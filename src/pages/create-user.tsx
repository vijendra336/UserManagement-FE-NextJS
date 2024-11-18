import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'

export const CreateUser: React.FunctionComponent = () => {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [dateOfBirth, setDateOfBirth] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [errors, setErrors] = useState<{ [key: string]: string }>({})
    const [isFormValid, setIsFormValid] = useState(false)
    const router = useRouter()

    // Format phone number as (XXX) XXX-XXXX
    const formatPhoneNumber = (value: string) => {
        const phoneNumber = value.replace(/[^\d]/g, '') // Remove non-numeric characters
        const phoneNumberLength = phoneNumber.length

        if (phoneNumberLength < 4) {
            return `(${phoneNumber}`;
        } else if (phoneNumberLength < 7) {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
        } else {
            return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const formattedPhoneNumber = formatPhoneNumber(e.target.value)
        setPhoneNumber(formattedPhoneNumber)
    }

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {}
        let isValid = true

        // First Name validation
        if (!firstName.trim()) {
            newErrors.firstName = 'First Name is required.'
            isValid = false
        }

        // Last Name validation
        if (!lastName.trim()) {
            newErrors.lastName = 'Last Name is required.'
            isValid = false
        }

        // Date of Birth validation
        if (!dateOfBirth) {
            newErrors.dateOfBirth = 'Date of Birth is required.'
            isValid = false
        } else {
            // Calculate age based on the date of birth
            const birthDate = new Date(dateOfBirth)
            const today = new Date()
            const age = today.getFullYear() - birthDate.getFullYear()
            const monthDifference = today.getMonth() - birthDate.getMonth()

            // Check if the user is at least 18 years old
            if (age < 18 || (age === 18 && monthDifference < 0)) {
                newErrors.dateOfBirth = 'User must be at least 18 years old.'
                isValid = false
            }
        }

        // Phone Number validation
        const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/ // Check if phone number matches (XXX) XXX-XXXX format
        if (!phoneNumber.match(phoneRegex)) {
            newErrors.phoneNumber = 'Phone number must be in the format (XXX) XXX-XXXX.'
            isValid = false
        }

        setErrors(newErrors)
        setIsFormValid(isValid)
        return isValid
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (validateForm()) {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ firstName, lastName, dateOfBirth, phoneNumber }),
            })

            if (response.ok) {
                setFirstName('')
                setLastName('')
                setDateOfBirth('')
                setPhoneNumber('')
                router.push('/user-list')
            } else {
                console.error('Failed to create user')
            }
        }
    }

    // Get current date to set as max date
    const today = new Date().toISOString().split('T')[0]

    useEffect(() => {
        validateForm() // Validate form whenever any input changes
    }, [firstName, lastName, dateOfBirth, phoneNumber])

    // Handle "Back to User List" navigation
    const handleBackToUserList = () => {
        router.push('/user-list');
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Create New User</h2>
            <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: '500px' }}>
                {/* First Name */}
                <div className="mb-3">
                    <label htmlFor="firstName" className="form-label">First Name</label>
                    <input 
                        type="text" 
                        id="firstName" 
                        className="form-control" 
                        value={firstName} 
                        onChange={(e) => setFirstName(e.target.value)} 
                    />
                    {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                </div>

                {/* Last Name */}
                <div className="mb-3">
                    <label htmlFor="lastName" className="form-label">Last Name</label>
                    <input 
                        type="text" 
                        id="lastName" 
                        className="form-control" 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)} 
                    />
                    {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                </div>

                {/* Date of Birth */}
                <div className="mb-3">
                    <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                    <input 
                        type="date" 
                        id="dateOfBirth" 
                        className="form-control" 
                        value={dateOfBirth} 
                        onChange={(e) => setDateOfBirth(e.target.value)} 
                        max={today} // Restrict to past dates only
                    />
                    {errors.dateOfBirth && <div className="text-danger">{errors.dateOfBirth}</div>}
                </div>

                {/* Phone Number */}
                <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                    <input 
                        type="text" 
                        id="phoneNumber" 
                        className="form-control" 
                        value={phoneNumber} 
                        onChange={handlePhoneNumberChange} 
                        maxLength={14} // Limit input length to fit the format (XXX) XXX-XXXX
                    />
                    {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                </div>

                {/* Submit Button */}
                <div className="d-grid gap-2">
                    <button 
                        type="submit" 
                        className="btn btn-primary" 
                        disabled={!isFormValid} // Disable the button if the form is invalid
                    >
                        Create User
                    </button>
                </div>
            </form>

            {/* Back to User List Button */}
            <div className="d-grid gap-2 mt-3">
                <button 
                    type="button" 
                    className="btn btn-secondary" 
                    onClick={handleBackToUserList}
                >
                    Back to User List
                </button>
            </div>
        </div>
    )
}

export default CreateUser
