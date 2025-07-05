import React, { useEffect, useState } from 'react';
import SideBarBus from '../BUSComponent/SideBarBus';
import TopHeader from '../HRComponents/TopHeader';
import { generateBusPDF } from '../utils/generatePdfBus';
import { Button, Container, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaFilter, FaSearch, FaDownload, FaPen, FaTrash } from 'react-icons/fa';
import './AddBus.css';
import axios from 'axios';

const AddBus = () => {
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    busNumber: '',
    brand: '',
    model: '',
    seatCapacity: '',
    type: '',
    insuranceExpiry: '',
    imageSource: 'upload',
    imageFile: null,
    imageUrl: ''
  });

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/buses');
      setBuses(res.data);
    } catch (err) {
      console.error('Error fetching buses:', err);
    }
  };

  const handleInputChange = async (e) => {
  const { name, value } = e.target;

  if (name === 'seatCapacity') {
    // Allow only numbers
    if (!/^\d*$/.test(value)) {
      setErrors((prev) => ({ ...prev, seatCapacity: 'Only numbers allowed' }));
      return;
    } else {
      setErrors((prev) => ({ ...prev, seatCapacity: '' }));
    }
    setFormData((prev) => ({ ...prev, seatCapacity: value }));
  }

  else if (name === 'busNumber') {
    const regex = /^[A-Za-z]{0,3}-?\d{0,4}$/;
    if (!regex.test(value)) return; // prevent invalid format

    let error = '';
    const [letters, digits] = value.split('-');

    if (!value.includes('-')) {
      error = 'Hyphen (-) required after letters';
    } else if (!letters || letters.length < 2) {
      error = 'Must be at least 2 letters';
    } else if (letters.length > 3) {
      error = 'Maximum 3 letters allowed';
    } else if (!digits || digits.length !== 4) {
      error = 'Must have exactly 4 digits after hyphen';
    }

    // Check uniqueness
    const isDuplicate = buses.some(
      (bus) => bus.busNumber.toLowerCase() === value.toLowerCase()
    );
    if (isDuplicate) {
      error = 'Bus number already taken';
    }

    setErrors((prev) => ({ ...prev, busNumber: error }));
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  else if (name === 'insuranceExpiry') {
    const selectedDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      setErrors((prev) => ({ ...prev, insuranceExpiry: 'Expiry date must be in the future' }));
    } else {
      setErrors((prev) => ({ ...prev, insuranceExpiry: '' }));
    }
    setFormData((prev) => ({ ...prev, insuranceExpiry: value }));
  }

  else {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
};


  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBus, setEditingBus] = useState(null);
  const [errors, setErrors] = useState({
  busNumber: '',
  seatCapacity: '',
  insuranceExpiry: ''
});

  const filteredBuses = buses.filter((bus) => {
  const matchesSearch =
    bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bus.model.toLowerCase().includes(searchQuery.toLowerCase());

  const matchesType = selectedType === '' || bus.type === selectedType;

  return matchesSearch && matchesType;
});

  const handleFormSubmit = async () => {
  // Check if there are any validation errors or empty required fields
  const hasErrors = Object.values(errors).some(err => err !== '');
  const hasEmptyRequiredFields = !formData.busNumber || !formData.brand || !formData.model || !formData.seatCapacity || !formData.type || !formData.insuranceExpiry;

  if (hasErrors || hasEmptyRequiredFields) {
    setMessageContent('Please fix validation errors before submitting ❌');
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 3000);
    return;
  }

  try {
    const data = new FormData();
    data.append('busNumber', formData.busNumber);
    data.append('brand', formData.brand);
    data.append('model', formData.model);
    data.append('seatCapacity', formData.seatCapacity);
    data.append('type', formData.type);
    data.append('insuranceExpiry', formData.insuranceExpiry);

    if (formData.imageSource === 'upload' && formData.imageFile) {
      data.append('image', formData.imageFile);
    } else if (formData.imageSource === 'url' && formData.imageUrl) {
      data.append('image', formData.imageUrl);
    }

    await axios.post('http://localhost:5000/api/buses', data);
    fetchBuses();
    setMessageContent('Bus saved successfully ✅');
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 3000);
    handleClose();
  } catch (err) {
    console.error('Error saving bus:', err);
    setMessageContent('Failed to save bus ❌');
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 3000);
  }
};

  const handleDelete = async (busId) => {
  const confirm = window.confirm('Are you sure you want to delete this bus?');
  if (!confirm) return;

  try {
    await axios.delete(`http://localhost:5000/api/buses/${busId}`);
    fetchBuses(); // refresh table
  } catch (err) {
    console.error('Error deleting bus:', err);
  }
};

const openEditModal = (bus) => {
  setEditingBus({
    ...bus,
    imageSource: bus.image.startsWith('http') ? 'url' : 'upload',
    imageFile: null,
    imageUrl: bus.image.startsWith('http') ? bus.image : ''
  });
  setShowEditModal(true);
};

const handleEditInputChange = (e) => {
  const { name, value, files } = e.target;
  if (name === 'imageFile') {
    setEditingBus((prev) => ({ ...prev, imageFile: files[0] }));
  } else {
    setEditingBus((prev) => ({ ...prev, [name]: value }));
  }
};

const handleUpdateBus = async () => {
  try {
    const form = new FormData();
    form.append('busNumber', editingBus.busNumber);
    form.append('brand', editingBus.brand);
    form.append('model', editingBus.model);
    form.append('seatCapacity', editingBus.seatCapacity);
    form.append('type', editingBus.type);

    if (editingBus.imageSource === 'upload' && editingBus.imageFile) {
      form.append('image', editingBus.imageFile);
    } else if (editingBus.imageSource === 'url' && editingBus.imageUrl) {
      form.append('image', editingBus.imageUrl);
    }

    await axios.put(`http://localhost:5000/api/buses/${editingBus._id}`, form);
    
    setShowEditModal(false);
    setEditingBus(null);
    fetchBuses();

    // ✅ Show success popup
    setMessageContent("Bus updated successfully ✅");
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 3000);

  } catch (err) {
    console.error('Error updating bus:', err);

    // ❌ Show failure popup
    setShowEditModal(false);
    setMessageContent("Update failed ❌");
    setShowMessageModal(true);
    setTimeout(() => setShowMessageModal(false), 3000);
  }
};

  const handleClose = () => {
    setShowModal(false);
    setFormData({
      busNumber: '',
      brand: '',
      model: '',
      seatCapacity: '',
      type: '',
      insuranceExpiry: '',
      imageSource: 'upload',
      imageFile: null,
      imageUrl: ''
    });
  };

  const handleShow = () => setShowModal(true);

  const handleDownloadPDF = () => {
    const filteredData = buses.filter(bus => {
      const matchesSearch = searchQuery === '' || bus.busNumber.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === '' || bus.type === selectedType;
      return matchesSearch && matchesType;
    });

    generateBusPDF(filteredData);
  };
  
  return (
    <div>
      <TopHeader />
      <div className="main-container d-flex">
        <SideBarBus />

        <div className="bus_container flex-grow-1 p-4">
          <Container fluid className="mb-4">
            <Row className="align-items-center justify-content-between">
              <Col xs="auto">
                <Button className="btn btn-dark px-4"  onClick={handleShow}> 
                  <FaPlus className="me-2" /> Add Bus
                </Button>
              </Col>
              
              <Col xs="auto">
                <div className="d-flex gap-2 align-items-center">
                  <Form.Select
                    className="bus-filter-select"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <option value="">
                       Filter (All Types)
                    </option>
                    <option value="Normal">Normal</option>
                    <option value="Semi luxury">Semi luxury</option>
                    <option value="A/C">A/C</option>
                    <option value="Luxury">Luxury</option>
                  </Form.Select>

                  {showFilterDropdown && (
                    <div className="mt-2">
                      <Form.Select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                      >
                        <option value="">All Types</option>
                        <option value="Normal">Normal</option>
                        <option value="Semi luxury">Semi luxury</option>
                        <option value="A/C">A/C</option>
                        <option value="Luxury">Luxury</option>
                      </Form.Select>
                    </div>
                  )}

                  <div className="search-wrapper">
                    <FaSearch className="search-icon" />
                    <input
                      type="text"
                      className="bus-search-input"
                      placeholder="Search bus..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />

                  </div>
                  <Button
                    className="bus-btn1"
                    variant="dark"
                    onClick={() => {
                      if (filteredBuses.length === 0) {
                        setMessageContent("No results to download ❌");
                        setShowMessageModal(true);
                        setTimeout(() => setShowMessageModal(false), 3000);
                        return;
                      }
                      generateBusPDF(filteredBuses);
                    }}
                  >
                    <FaDownload className="me-2" /> Download PDF
                  </Button>

                </div>
              </Col>
            </Row>
          </Container>

          <div>
            <h4>Registered Buses</h4>
            <div className="bus-table-wrapper">
              <div className="bus-table-header d-flex px-3 py-2">
                <div className="bus-col image">Image</div>
                <div className="bus-col">Bus Number</div>
                <div className="bus-col">Brand</div>
                <div className="bus-col">Model</div>
                <div className="bus-col">Seat Capacity</div>
                <div className="bus-col">Type</div>
                <div className="bus-col action">Action</div>
              </div>
              <div className="bus-table-body">
                {filteredBuses.map((bus) => (
                  <div key={bus._id} className="bus-row d-flex align-items-center px-3 py-2">
                    <div className="bus-col image text-center">
                      <img
                        src={bus.image.startsWith('http') ? bus.image : `http://localhost:5000/uploads/${bus.image}`}
                        alt="bus"
                        className="bus-img-icon"
                      />
                    </div>
                    <div className="bus-col">{bus.busNumber}</div>
                    <div className="bus-col">{bus.brand}</div>
                    <div className="bus-col">{bus.model}</div>
                    <div className="bus-col">{bus.seatCapacity}</div>
                    <div className="bus-col">{bus.type}</div>
                    <div className="bus-col action d-flex justify-content-center gap-2">
                      <FaPen className="action-icon1 text-primary" onClick={() => openEditModal(bus)} />
                      <FaTrash
                        className="action-icon text-danger"
                        onClick={() => {
                          setBusToDelete(bus._id);
                          setShowDeleteModal(true);
                        }}
                      />

                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Modal show={showModal} onHide={handleClose} centered dialogClassName="custom-modal">
            <Modal.Header closeButton>
              <Modal.Title>Add New Bus</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Bus Number</Form.Label>
                  <Form.Control
                    name="busNumber"
                    value={formData.busNumber}
                    onChange={handleInputChange}
                    isInvalid={!!errors.busNumber}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.busNumber}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Brand</Form.Label>
                  <Form.Control name="brand" value={formData.brand} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Model</Form.Label>
                  <Form.Control name="model" value={formData.model} onChange={handleInputChange} />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Seat Capacity</Form.Label>
                  <Form.Select
                    name="seatCapacity"
                    value={formData.seatCapacity}
                    onChange={handleInputChange}
                    isInvalid={!!errors.seatCapacity}
                  >
                    <option value="">Select Seat Capacity</option>
                    <option value="33">33</option>
                    <option value="44">44</option>
                    <option value="49">49</option>
                    <option value="54">54</option>
                    <option value="59">59</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.seatCapacity}
                  </Form.Control.Feedback>
                  <Form.Control.Feedback type="invalid">
                    {errors.seatCapacity}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select name="type" value={formData.type} onChange={handleInputChange}>
                    <option value="">Select Type</option>
                    <option>Normal</option>
                    <option>Semi luxury</option>
                    <option>A/C</option>
                    <option>Luxury</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Insurance Expiry</Form.Label>
                  <Form.Control
                    type="date"
                    name="insuranceExpiry"
                    value={formData.insuranceExpiry}
                    onChange={handleInputChange}
                    isInvalid={!!errors.insuranceExpiry}
                    min={new Date().toISOString().split('T')[0]}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.insuranceExpiry}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Image Source</Form.Label>
                  <Form.Select name="imageSource" value={formData.imageSource} onChange={handleInputChange}>
                    <option value="upload">Upload from Device</option>
                    <option value="url">Paste Image URL</option>
                  </Form.Select>
                </Form.Group>
                {formData.imageSource === 'upload' ? (
                  <Form.Group className="mb-3">
                    <Form.Label>Upload Image</Form.Label>
                    <Form.Control
                      type="file"
                      name="imageFile"
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          imageSource: 'upload',
                          imageFile: e.target.files[0],
                          imageUrl: ''
                        }))
                      }
                    />
                  </Form.Group>
                ) : (
                  <Form.Group className="mb-3">
                    <Form.Label>Image URL</Form.Label>
                    <Form.Control type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} />
                  </Form.Group>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button variant="dark" onClick={handleFormSubmit}>Save Bus</Button>
            </Modal.Footer>
          </Modal>
          {/* Delete Confirmation Modal */}
          <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
            <Modal.Header closeButton>
              <Modal.Title>Confirm Deletion</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Are you sure you want to delete this bus?
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
              <Button
                variant="danger"
                onClick={async () => {
            try {
              await axios.delete(`http://localhost:5000/api/buses/${busToDelete}`);
              setShowDeleteModal(false);
              fetchBuses();
              setMessageContent('Bus deleted successfully ✅');
              setShowMessageModal(true);

              setTimeout(() => {
                setShowMessageModal(false);
              }, 3000); // auto-close after 3 seconds
            } catch (err) {
              setShowDeleteModal(false);
              setMessageContent('Something went wrong ❌');
              setShowMessageModal(true);

              setTimeout(() => {
                setShowMessageModal(false);
              }, 3000); // auto-close after 3 seconds
            }
          }}

              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Success/Error Message Modal */}
          <Modal show={showMessageModal} onHide={() => setShowMessageModal(false)} centered>
            <Modal.Body className="text-center">{messageContent}</Modal.Body>
          </Modal>

          {/* Edit Bus Modal */}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered dialogClassName="custom-modal">
  <Modal.Header closeButton>
    <Modal.Title>Update Bus</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    {editingBus && (
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Bus Number</Form.Label>
          <Form.Control name="busNumber" value={editingBus.busNumber} onChange={handleEditInputChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Brand</Form.Label>
          <Form.Control name="brand" value={editingBus.brand} onChange={handleEditInputChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Model</Form.Label>
          <Form.Control name="model" value={editingBus.model} onChange={handleEditInputChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Seat Capacity</Form.Label>
          <Form.Control type="number" name="seatCapacity" value={editingBus.seatCapacity} onChange={handleEditInputChange} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Type</Form.Label>
          <Form.Select name="type" value={editingBus.type} onChange={handleEditInputChange}>
            <option value="">Select Type</option>
            <option>Normal</option>
            <option>Semi luxury</option>
            <option>A/C</option>
            <option>Luxury</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>Image Source</Form.Label>
          <Form.Select name="imageSource" value={editingBus.imageSource} onChange={handleEditInputChange}>
            <option value="upload">Upload from Device</option>
            <option value="url">Paste Image URL</option>
          </Form.Select>
        </Form.Group>
        {editingBus.imageSource === 'upload' ? (
          <Form.Group className="mb-3">
            <Form.Label>Upload New Image</Form.Label>
            <Form.Control type="file" name="imageFile" onChange={handleEditInputChange} />
          </Form.Group>
        ) : (
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control type="text" name="imageUrl" value={editingBus.imageUrl} onChange={handleEditInputChange} />
          </Form.Group>
        )}
      </Form>
    )}
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
    <Button variant="dark" onClick={handleUpdateBus}>Update Bus</Button>
  </Modal.Footer>
</Modal>


        </div>
      </div>
    </div>
  );
};

export default AddBus;
