-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 27, 2026 at 05:28 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hims`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointment`
--

CREATE TABLE `appointment` (
  `AppointmentID` int(11) NOT NULL,
  `PatientID` int(11) NOT NULL,
  `DoctorCode` varchar(10) NOT NULL,
  `AppointmentDate` datetime NOT NULL,
  `Diagnosis` text DEFAULT NULL,
  `Treatment` text DEFAULT NULL,
  `Status` varchar(20) DEFAULT 'Scheduled'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointment`
--

INSERT INTO `appointment` (`AppointmentID`, `PatientID`, `DoctorCode`, `AppointmentDate`, `Diagnosis`, `Treatment`, `Status`) VALUES
(1, 1, 'DR001', '2026-05-29 04:44:00', 'special treatmnet', 'solved', 'Completed');

-- --------------------------------------------------------

--
-- Table structure for table `doctor`
--

CREATE TABLE `doctor` (
  `DoctorCode` varchar(10) NOT NULL,
  `DoctorName` varchar(100) NOT NULL,
  `Specialization` varchar(100) DEFAULT NULL,
  `Telephone` varchar(15) DEFAULT NULL,
  `Email` varchar(100) DEFAULT NULL,
  `HireDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor`
--

INSERT INTO `doctor` (`DoctorCode`, `DoctorName`, `Specialization`, `Telephone`, `Email`, `HireDate`) VALUES
('DR001', 'WITBRI', 'dents', '078922222', 'witbri@gmail.com', '2026-05-27');

-- --------------------------------------------------------

--
-- Table structure for table `patient`
--

CREATE TABLE `patient` (
  `PatientID` int(11) NOT NULL,
  `FirstName` varchar(50) NOT NULL,
  `LastName` varchar(50) NOT NULL,
  `Gender` varchar(10) DEFAULT NULL,
  `Telephone` varchar(15) DEFAULT NULL,
  `Address` text DEFAULT NULL,
  `RegistrationDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient`
--

INSERT INTO `patient` (`PatientID`, `FirstName`, `LastName`, `Gender`, `Telephone`, `Address`, `RegistrationDate`) VALUES
(1, 'witness', 'fabrice', 'Male', '078934444', 'kigali', '2026-05-01');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `UserID` int(11) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Role` varchar(20) DEFAULT 'Staff',
  `CreatedAt` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`UserID`, `Username`, `Password`, `Role`, `CreatedAt`) VALUES
(1, 'admin', '$2b$10$mW22lBk1hTY.DeLkokGew.cGeZlC/Xk4L8ML4HkNKO0qSOR./0F22', 'Staff', '2026-05-27 02:41:31'),
(2, 'witbri', '$2b$10$K/Iav1PL1pwQFvMJ0EL0oujbyMQ6QbyKZ0HFbdAwVB6UMPP.H2z6C', 'Admin', '2026-05-27 03:24:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointment`
--
ALTER TABLE `appointment`
  ADD PRIMARY KEY (`AppointmentID`),
  ADD KEY `FK_Appointment_Patient` (`PatientID`),
  ADD KEY `FK_Appointment_Doctor` (`DoctorCode`);

--
-- Indexes for table `doctor`
--
ALTER TABLE `doctor`
  ADD PRIMARY KEY (`DoctorCode`),
  ADD UNIQUE KEY `Email` (`Email`);

--
-- Indexes for table `patient`
--
ALTER TABLE `patient`
  ADD PRIMARY KEY (`PatientID`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`UserID`),
  ADD UNIQUE KEY `Username` (`Username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointment`
--
ALTER TABLE `appointment`
  MODIFY `AppointmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `patient`
--
ALTER TABLE `patient`
  MODIFY `PatientID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointment`
--
ALTER TABLE `appointment`
  ADD CONSTRAINT `FK_Appointment_Doctor` FOREIGN KEY (`DoctorCode`) REFERENCES `doctor` (`DoctorCode`) ON UPDATE CASCADE,
  ADD CONSTRAINT `FK_Appointment_Patient` FOREIGN KEY (`PatientID`) REFERENCES `patient` (`PatientID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
