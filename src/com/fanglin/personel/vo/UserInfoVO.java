package com.fanglin.personel.vo;

public class UserInfoVO implements java.io.Serializable {

	private static final long serialVersionUID = -3235815301177677490L;

	private Long uiid;

	private UserVO user;

	private String employWay;

	private String recommendMan;

	private Integer jobYears;

	private String employType;

	private String entryTime;

	private String employTime;

	private Integer serviceYears;

	private Integer age;

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

	private Long salary;

	private String lover;

	private String bank;

	private String bankCardNum;

	private String qq;

	private String wechat;

	private String email;

	private String profiles;

	public UserInfoVO() {
		super();
	}

	public UserInfoVO(UserVO user) {
		super();
		this.user = user;
	}

	public Long getUiid() {
		return this.uiid;
	}

	public void setUiid(Long uiid) {
		this.uiid = uiid;
	}

	public UserVO getUser() {
		return user;
	}

	public void setUser(UserVO user) {
		this.user = user;
	}

	public String getEmployWay() {
		return this.employWay;
	}

	public void setEmployWay(String employWay) {
		this.employWay = employWay;
	}

	public String getRecommendMan() {
		return this.recommendMan;
	}

	public void setRecommendMan(String recommendMan) {
		this.recommendMan = recommendMan;
	}

	public Integer getJobYears() {
		return this.jobYears;
	}

	public void setJobYears(Integer jobYears) {
		this.jobYears = jobYears;
	}

	public String getEmployType() {
		return this.employType;
	}

	public void setEmployType(String employType) {
		this.employType = employType;
	}

	public String getEntryTime() {
		return this.entryTime;
	}

	public void setEntryTime(String entryTime) {
		this.entryTime = entryTime;
	}

	public String getEmployTime() {
		return this.employTime;
	}

	public void setEmployTime(String employTime) {
		this.employTime = employTime;
	}

	public Integer getServiceYears() {
		return this.serviceYears;
	}

	public void setServiceYears(Integer serviceYears) {
		this.serviceYears = serviceYears;
	}

	public Integer getAge() {
		return this.age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getPolitical() {
		return this.political;
	}

	public void setPolitical(String political) {
		this.political = political;
	}

	public String getEmergencyMan() {
		return this.emergencyMan;
	}

	public void setEmergencyMan(String emergencyMan) {
		this.emergencyMan = emergencyMan;
	}

	public String getEmergencyPhone() {
		return this.emergencyPhone;
	}

	public void setEmergencyPhone(String emergencyPhone) {
		this.emergencyPhone = emergencyPhone;
	}

	public String getIsPresentGraduate() {
		return this.isPresentGraduate;
	}

	public void setIsPresentGraduate(String isPresentGraduate) {
		this.isPresentGraduate = isPresentGraduate;
	}

	public String getGraduateTime() {
		return this.graduateTime;
	}

	public void setGraduateTime(String graduateTime) {
		this.graduateTime = graduateTime;
	}

	public String getSchool() {
		return this.school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	public String getEducation() {
		return this.education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public String getSpecialty() {
		return this.specialty;
	}

	public void setSpecialty(String specialty) {
		this.specialty = specialty;
	}

	public String getIsMarried() {
		return this.isMarried;
	}

	public void setIsMarried(String isMarried) {
		this.isMarried = isMarried;
	}

	public String getIsBirth() {
		return this.isBirth;
	}

	public void setIsBirth(String isBirth) {
		this.isBirth = isBirth;
	}

	public String getIsHouseLoan() {
		return this.isHouseLoan;
	}

	public void setIsHouseLoan(String isHouseLoan) {
		this.isHouseLoan = isHouseLoan;
	}

	public String getIsCarLoan() {
		return this.isCarLoan;
	}

	public void setIsCarLoan(String isCarLoan) {
		this.isCarLoan = isCarLoan;
	}

	public String getHouseType() {
		return this.houseType;
	}

	public void setHouseType(String houseType) {
		this.houseType = houseType;
	}

	public String getHouseholdType() {
		return this.householdType;
	}

	public void setHouseholdType(String householdType) {
		this.householdType = householdType;
	}

	public String getHometownAddress() {
		return this.hometownAddress;
	}

	public void setHometownAddress(String hometownAddress) {
		this.hometownAddress = hometownAddress;
	}

	public String getAddress() {
		return this.address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getIsContract() {
		return this.isContract;
	}

	public void setIsContract(String isContract) {
		this.isContract = isContract;
	}

	public String getIsInsurance() {
		return this.isInsurance;
	}

	public void setIsInsurance(String isInsurance) {
		this.isInsurance = isInsurance;
	}

	public String getInsuranceTime() {
		return this.insuranceTime;
	}

	public void setInsuranceTime(String insuranceTime) {
		this.insuranceTime = insuranceTime;
	}

	public String getPensionNum() {
		return this.pensionNum;
	}

	public void setPensionNum(String pensionNum) {
		this.pensionNum = pensionNum;
	}

	public String getMedicalNum() {
		return this.medicalNum;
	}

	public void setMedicalNum(String medicalNum) {
		this.medicalNum = medicalNum;
	}

	public Long getSalary() {
		return this.salary;
	}

	public void setSalary(Long salary) {
		this.salary = salary;
	}

	public String getLover() {
		return this.lover;
	}

	public void setLover(String lover) {
		this.lover = lover;
	}

	public String getBank() {
		return this.bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public String getBankCardNum() {
		return this.bankCardNum;
	}

	public void setBankCardNum(String bankCardNum) {
		this.bankCardNum = bankCardNum;
	}

	public String getQq() {
		return this.qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getWechat() {
		return this.wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getEmail() {
		return this.email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getProfiles() {
		return profiles;
	}

	public void setProfiles(String profiles) {
		this.profiles = profiles;
	}

}