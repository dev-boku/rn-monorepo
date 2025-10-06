import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render button with title', () => {
      render(<Button title="Test Button" />);
      expect(screen.getByText('Test Button')).toBeTruthy();
    });

    it('should render with primary variant by default', () => {
      render(<Button title="Primary Button" />);
      const button = screen.getByTestId('button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: '#007AFF',
          }),
        ])
      );
    });

    it('should render with secondary variant', () => {
      render(<Button title="Secondary Button" variant="secondary" />);
      const button = screen.getByTestId('button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: '#F0F0F0',
          }),
        ])
      );
    });

    it('should render with danger variant', () => {
      render(<Button title="Danger Button" variant="danger" />);
      const button = screen.getByTestId('button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            backgroundColor: '#FF3B30',
          }),
        ])
      );
    });

    it('should render with different sizes', () => {
      const { rerender } = render(<Button title="Small" size="small" />);
      let button = screen.getByTestId('button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingHorizontal: 12,
            paddingVertical: 6,
          }),
        ])
      );

      rerender(<Button title="Large" size="large" />);
      button = screen.getByTestId('button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            paddingHorizontal: 20,
            paddingVertical: 14,
          }),
        ])
      );
    });

    it('should apply disabled styles when disabled', () => {
      render(<Button title="Disabled Button" disabled />);
      const button = screen.getByTestId('button');
      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            opacity: 0.5,
          }),
        ])
      );
      expect(button.props.accessibilityState).toEqual({ disabled: true });
    });

    it('should have correct accessibility props', () => {
      render(<Button title="Accessible Button" />);
      const button = screen.getByTestId('button');
      expect(button.props.accessibilityRole).toBe('button');
      expect(button.props.accessibilityState).toEqual({ disabled: false });
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      render(<Button title="Click Me" onPress={onPressMock} />);

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      render(<Button title="Disabled" disabled onPress={onPressMock} />);

      const button = screen.getByTestId('button');
      fireEvent.press(button);

      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  describe('Custom Styles', () => {
    it('should apply custom styles', () => {
      const customStyle = {
        backgroundColor: '#FF00FF',
        borderWidth: 2,
      };

      render(<Button title="Custom Style" style={customStyle} />);
      const button = screen.getByTestId('button');

      expect(button.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining(customStyle),
        ])
      );
    });

    it('should pass through additional TouchableOpacity props', () => {
      render(
        <Button
          title="With Props"
          activeOpacity={0.8}
          testID="custom-test-id"
        />
      );

      const button = screen.getByTestId('custom-test-id');
      expect(button.props.activeOpacity).toBe(0.8);
    });
  });

  describe('Text Styles', () => {
    it('should apply correct text color for primary variant', () => {
      render(<Button title="Primary Text" variant="primary" />);
      const text = screen.getByTestId('button-text');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color: '#FFFFFF',
          }),
        ])
      );
    });

    it('should apply correct text color for secondary variant', () => {
      render(<Button title="Secondary Text" variant="secondary" />);
      const text = screen.getByTestId('button-text');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            color: '#333333',
          }),
        ])
      );
    });

    it('should apply correct font size for different sizes', () => {
      const { rerender } = render(<Button title="Small Text" size="small" />);
      let text = screen.getByTestId('button-text');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 14,
          }),
        ])
      );

      rerender(<Button title="Large Text" size="large" />);
      text = screen.getByTestId('button-text');
      expect(text.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            fontSize: 18,
          }),
        ])
      );
    });
  });
});