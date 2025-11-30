import React, { useState } from 'react';
import { Modal, ModalWithHook } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';

export default {
  title: 'Components/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A reusable modal component with various sizes and configurations.',
      },
    },
  },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl', 'full'],
      description: 'Size of the modal',
      defaultValue: 'md',
    },
    showCloseButton: {
      control: 'boolean',
      description: 'Show/hide the close button',
      defaultValue: true,
    },
    closeOnOverlayClick: {
      control: 'boolean',
      description: 'Close modal when clicking outside',
      defaultValue: true,
    },
    lockScroll: {
      control: 'boolean',
      description: 'Prevent body scroll when modal is open',
      defaultValue: true,
    },
  },
};

// Basic Modal Template
const Template = (args) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Modal</Button>
      <Modal
        {...args}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Modal Title</h3>
          <p>
            This is a basic modal example. You can put any content here, including forms, images, or other components.
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsOpen(false)}>Confirm</Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// Modal with Hook Template
const HookTemplate = (args) => {
  return (
    <ModalWithHook
      {...args}
      title="Modal with Hook"
      trigger={<Button>Open Modal with Hook</Button>}
      footer={({ close }) => (
        <div className="flex justify-end space-x-2">
          <Button variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button onClick={close}>Confirm</Button>
        </div>
      )}
    >
      {({ close }) => (
        <div className="space-y-4">
          <p>
            This modal uses the useModal hook for more control. The close function is passed as a render prop.
          </p>
          <p>
            You can also access the modal state and other utilities through the render props.
          </p>
        </div>
      )}
    </ModalWithHook>
  );
};

// Sizes Template
const SizesTemplate = () => {
  const [activeSize, setActiveSize] = useState('md');
  const [isOpen, setIsOpen] = useState(false);
  
  const sizes = ['sm', 'md', 'lg', 'xl', 'full'];
  
  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        {sizes.map((size) => (
          <Button
            key={size}
            variant={activeSize === size ? 'primary' : 'secondary'}
            onClick={() => setActiveSize(size)}
          >
            {size.toUpperCase()}
          </Button>
        ))}
      </div>
      
      <Button onClick={() => setIsOpen(true)}>
        Open {activeSize.toUpperCase()} Modal
      </Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        size={activeSize}
        title={`${activeSize.toUpperCase()} Modal`}
      >
        <div className="space-y-4">
          <p>
            This is a <strong>{activeSize}</strong> sized modal. Resize your browser to see how it responds to different screen sizes.
          </p>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="secondary" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

// Form in Modal Template
const FormTemplate = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(JSON.stringify(formData, null, 2));
    setIsOpen(false);
  };
  
  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Open Form Modal</Button>
      
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Contact Us"
        size="md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              name="message"
              rows={4}
              value={formData.message}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div className="flex justify-end space-x-2 pt-2">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Send Message
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

// Export stories
export const Basic = Template.bind({});
Basic.args = {
  size: 'md',
  showCloseButton: true,
  closeOnOverlayClick: true,
  lockScroll: true,
};

export const WithHook = HookTemplate.bind({});
WithHook.parameters = {
  docs: {
    description: {
      story: 'Modal using the `useModal` hook for more control and flexibility.',
    },
  },
};

export const Sizes = SizesTemplate.bind({});
Sizes.parameters = {
  docs: {
    description: {
      story: 'Different modal sizes: sm, md, lg, xl, and full width.',
    },
  },
};

export const WithForm = FormTemplate.bind({});
WithForm.parameters = {
  docs: {
    description: {
      story: 'Example of a form inside a modal with controlled inputs.',
    },
  },
};

// Playground
export const Playground = Template.bind({});
Playground.parameters = {
  docs: {
    description: {
      story: 'Interactive playground to test different modal configurations.',
    },
  },
};
