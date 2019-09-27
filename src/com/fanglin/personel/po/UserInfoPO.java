package com.fanglin.personel.po;

import static javax.persistence.GenerationType.IDENTITY;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "userinfo", catalog = "communion")
public class UserInfoPO implements java.io.Serializable {

	private static final long serialVersionUID = -3915898990885585486L;

	private long uiid;

	private UserPO user;

	private String employWay;

	private String recommendMan;

	private int jobYears;

	private String employType;

	private String entryTime;

	private String employTime;

	private int serviceYears;

	private int age;

	private String political;

	private String emergencyMan;

	private String emergencyPhone;

	private String isPresentGraduate;

	private String graduateTime;

	private String school;

	private String education;

	private String specialty;

	private String isMarried;

	private String isBirth;

	private String isHouseLoan;

	private String isCarLoan;

	private String houseType;

	private String householdType;

	private String hometownAddress;

	private String address;

	private String isContract;

	private String isInsurance;

	private String insuranceTime;

	private String pensionNum;

	private String medicalNum;

	private long salary;

	private String lover;

	private String bank;

	private String bankCardNum;

	private String qq;

	private String wechat;

	private String email;

	private String profiles;

	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "uiid")
	public long getUiid() {
		return this.uiid;
	}

	public void setUiid(long uiid) {
		this.uiid = uiid;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "uid", referencedColumnName = "uid")
	public UserPO getUser() {
		return user;
	}

	public void setUser(UserPO user) {
		this.user = user;
	}

	@Column(name = "employWay")
	public String getEmployWay() {
		return this.employWay;
	}

	public void setEmployWay(String employWay) {
		this.employWay = employWay;
	}

	@Column(name = "recommendMan")
	public String getRecommendMan() {
		return this.recommendMan;
	}

	public void setRecommendMan(String recommendMan) {
		this.recommendMan = recommendMan;
	}

	@Column(name = "jobYears")
	public int getJobYears() {
		return this.jobYears;
	}

	public void setJobYears(int jobYears) {
		this.jobYears = jobYears;
	}

	@Column(name = "employType")
	public String getEmployType() {
		return this.employType;
	}

	public void setEmployType(String employType) {
		this.employType = employType;
	}

	@Column(name = "entryTime")
	public String getEntryTime() {
		return this.entryTime;
	}

	public void setEntryTime(String entryTime) {
		this.entryTime = entryTime;
	}

	@Column(name = "employTime")
	public String getEmployTime() {
		return this.employTime;
	}

	public void setEmployTime(String employTime) {
		this.employTime = employTime;
	}

	@Column(name = "serviceYears")
	public int getServiceYears() {
		return this.serviceYears;
	}

	public void setServiceYears(int serviceYears) {
		this.serviceYears = serviceYears;
	}

	@Column(name = "age")
	public int getAge() {
		return this.age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	@Column(name = "political")
	public String getPolitical() {
		return this.political;
	}

	public void setPolitical(String political) {
		this.political = political;
	}

	@Column(name = "emergencyMan")
	public String getEmergencyMan() {
		return this.emergencyMan;
	}

	public void setEmergencyMan(String emergencyMan) {
		this.emergencyMan = emergencyMan;
	}

	@Column(name = "emergencyPhone")
	public String getEmergencyPhone() {
		return this.emergencyPhone;
	}

	public void setEmergencyPhone(String emergencyPhone) {
		this.emergencyPhone = emergencyPhone;
	}

	@Column(name = "isPresentGraduate")
	public String getIsPresentGraduate() {
		return this.isPresentGraduate;
	}

	public void setIsPresentGraduate(String isPresentGraduate) {
		this.isPresentGraduate = isPresentGraduate;
	}

	@Column(name = "graduateTime")
	public String getGraduateTime() {
		return this.graduateTime;
	}

	public void setGraduateTime(String graduateTime) {
		this.graduateTime = graduateTime;
	}

	@Column(name = "school")
	public String getSchool() {
		return this.school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	@Column(name = "education")
	public String getEducation() {
		return this.education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	@Column(name = "specialty")
	public String getSpecialty() {
		return this.specialty;
	}

	public void setSpecialty(String specialty) {
		this.specialty = specialty;
	}

	@Column(name = "isMarried")
	public String getIsMarried() {
		return this.isMarried;
	}

	public void setIsMarried(String isMarried) {
		this.isMarried = isMarried;
	}

	@Column(name = "isBirth")
	public String getIsBirth() {
		return this.isBirth;
	}

	public void setIsBirth(String isBirth) {
		this.isBirth = isBirth;
	}

	@Column(name = "isHouseLoan")
	public String getIsHouseLoan() {
		return this.isHouseLoan;
	}

	public void setIsHouseLoan(String isHouseLoan) {
		this.isHouseLoan = isHouseLoan;
	}

	@Column(name = "isCarLoan")
	public String getIsCarLoan() {
		return this.isCarLoan;
	}

	public void setIsCarLoan(String isCarLoan) {
		this.isCarLoan = isCarLoan;
	}

	@Column(name = "houseType")
	public String getHouseType() {
		return this.houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	@Column(name = "householdType")
	public String getHouseholdType() {
		return this.householdType;
	}

	public void setHouseholdType(String householdType) {
		this.householdType = householdType;
	}

	@Column(name = "hometownAddress")
	public String getHometownAddress() {
		return this.hometownAddress;
	}

	public void setHometownAddress(String hometownAddress) {
		this.hometownAddress = hometownAddress;
	}

	@Column(name = "address")
	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	@Column(name = "isContract")
	public String getIsContract() {
		return this.isContract;
	}

	public void setIsContract(String isContract) {
		this.isContract = isContract;
	}

	@Column(name = "isInsurance")
	public String getIsInsurance() {
		return this.isInsurance;
	}

	public void setIsInsurance(String isInsurance) {
		this.isInsurance = isInsurance;
	}

	@Column(name = "insuranceTime")
	public String getInsuranceTime() {
		return this.insuranceTime;
	}

	public void setInsuranceTime(String insuranceTime) {
		this.insuranceTime = insuranceTime;
	}

	@Column(name = "pensionNum")
	public String getPensionNum() {
		return this.pensionNum;
	}

	public void setPensionNum(String pensionNum) {
		this.pensionNum = pensionNum;
	}

	@Column(name = "medicalNum")
	public String getMedicalNum() {
		return this.medicalNum;
	}

	public void setMedicalNum(String medicalNum) {
		this.medicalNum = medicalNum;
	}

	@Column(name = "salary")
	public long getSalary() {
		return this.salary;
	}

	public void setSalary(long salary) {
		this.salary = salary;
	}

	@Column(name = "lover")
	public String getLover() {
		return this.lover;
	}

	public void setLover(String lover) {
		this.lover = lover;
	}

	@Column(name = "bank")
	public String getBank() {
		return this.bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	@Column(name = "bankCardNum")
	public String getBankCardNum() {
		return this.bankCardNum;
	}

	public void setBankCardNum(String bankCardNum) {
		this.bankCardNum = bankCardNum;
	}

	@Column(name = "qq")
	public String getQq() {
		return this.qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	@Column(name = "wechat")
	public String getWechat() {
		return this.wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	@Column(name = "email")
	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	@Column(name = "profiles")
	public String getProfiles() {
		return profiles;
	}

	public void setProfiles(String profiles) {
		this.profiles = profiles;
	}

}