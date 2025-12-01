package com.fanglin.personel.vo;

import java.sql.Timestamp;

public class UserInfoVO implements java.io.Serializable {

	private static final long serialVersionUID = -3235815301177677490L;

	private Long uiid;

	private UserVO user;

	private Short level;

	private Integer gender;

	private Integer height;

	private Integer weight;

	private Short political;

	private String nation;

	private String hobby;

	private String qq;

	private String wechat;

	private String email;

	private Short isMarried;

	private Short isBirth;

	private Short isHouseLoan;

	private Short isCarLoan;

	private Short isCarID;

	private Short isPassID;

	private Short isHMID;

	private Short isTWID;

	private Short householdType;

	private String hometownAddress;

	private String address;

	private String lover;

	private String claner;

	private String clanerCom;

	private String emergencyMan;

	private String emergencyPhone;

	private UserVO fangliner;

	private String firstTime;

	private String entryTime;

	private String boardTime;

	private Timestamp hireTime;

	private Timestamp fireTime;

	private Timestamp tranTime;

	private Short employWay;

	private String recommendMan;

	private Integer jobYears;

	private Short employType;

	private String employTime;

	private Short isPresentGraduate;

	private String graduateTime;

	private String school;

	private Short education;

	private String specialty;

	private String isContract;

	private String signTime;

	private String eignTime;

	private String fignTime;

	private Integer signNum;

	private String preformNum;

	private String formTime;

	private Short isInsurance;

	private Short insuranceType;

	private String insuranceTime;

	private String pensionNum;

	private String medicalNum;

	private String publicNum;

	private String palary;

	private String salary;

	private String bank;

	private String bankCardNum;

	private String comment;

	private String rank;

	private Short form;

	private String hometownPlace;

	public UserInfoVO() {
		super();
	}

	public UserInfoVO(UserVO user) {
		super();
		this.user = user;
	}

	public UserInfoVO(UserVO user, UserVO fangliner) {
		super();
		this.user = user;
		this.fangliner = fangliner;
	}

	public Long getUiid() {
		return uiid;
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

	public Short getLevel() {
		return level;
	}

	public void setLevel(Short level) {
		this.level = level;
	}

	public Integer getGender() {
		return gender;
	}

	public void setGender(Integer gender) {
		this.gender = gender;
	}

	public Integer getHeight() {
		return height;
	}

	public void setHeight(Integer height) {
		this.height = height;
	}

	public Integer getWeight() {
		return weight;
	}

	public void setWeight(Integer weight) {
		this.weight = weight;
	}

	public Short getPolitical() {
		return political;
	}

	public void setPolitical(Short political) {
		this.political = political;
	}

	public String getNation() {
		return nation;
	}

	public void setNation(String nation) {
		this.nation = nation;
	}

	public String getHobby() {
		return hobby;
	}

	public void setHobby(String hobby) {
		this.hobby = hobby;
	}

	public String getQq() {
		return qq;
	}

	public void setQq(String qq) {
		this.qq = qq;
	}

	public String getWechat() {
		return wechat;
	}

	public void setWechat(String wechat) {
		this.wechat = wechat;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Short getIsMarried() {
		return isMarried;
	}

	public void setIsMarried(Short isMarried) {
		this.isMarried = isMarried;
	}

	public Short getIsBirth() {
		return isBirth;
	}

	public void setIsBirth(Short isBirth) {
		this.isBirth = isBirth;
	}

	public Short getIsHouseLoan() {
		return isHouseLoan;
	}

	public void setIsHouseLoan(Short isHouseLoan) {
		this.isHouseLoan = isHouseLoan;
	}

	public Short getIsCarLoan() {
		return isCarLoan;
	}

	public void setIsCarLoan(Short isCarLoan) {
		this.isCarLoan = isCarLoan;
	}

	public Short getIsCarID() {
		return isCarID;
	}

	public void setIsCarID(Short isCarID) {
		this.isCarID = isCarID;
	}

	public Short getIsPassID() {
		return isPassID;
	}

	public void setIsPassID(Short isPassID) {
		this.isPassID = isPassID;
	}

	public Short getIsHMID() {
		return isHMID;
	}

	public void setIsHMID(Short isHMID) {
		this.isHMID = isHMID;
	}

	public Short getIsTWID() {
		return isTWID;
	}

	public void setIsTWID(Short isTWID) {
		this.isTWID = isTWID;
	}

	public Short getHouseholdType() {
		return householdType;
	}

	public void setHouseholdType(Short householdType) {
		this.householdType = householdType;
	}

	public String getHometownAddress() {
		return hometownAddress;
	}

	public void setHometownAddress(String hometownAddress) {
		this.hometownAddress = hometownAddress;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getLover() {
		return lover;
	}

	public void setLover(String lover) {
		this.lover = lover;
	}

	public String getClaner() {
		return claner;
	}

	public void setClaner(String claner) {
		this.claner = claner;
	}

	public String getClanerCom() {
		return clanerCom;
	}

	public void setClanerCom(String clanerCom) {
		this.clanerCom = clanerCom;
	}

	public String getEmergencyMan() {
		return emergencyMan;
	}

	public void setEmergencyMan(String emergencyMan) {
		this.emergencyMan = emergencyMan;
	}

	public String getEmergencyPhone() {
		return emergencyPhone;
	}

	public void setEmergencyPhone(String emergencyPhone) {
		this.emergencyPhone = emergencyPhone;
	}

	public UserVO getFangliner() {
		return fangliner;
	}

	public void setFangliner(UserVO fangliner) {
		this.fangliner = fangliner;
	}

	public String getFirstTime() {
		return firstTime;
	}

	public void setFirstTime(String firstTime) {
		this.firstTime = firstTime;
	}

	public String getEntryTime() {
		return entryTime;
	}

	public void setEntryTime(String entryTime) {
		this.entryTime = entryTime;
	}

	public String getBoardTime() {
		return boardTime;
	}

	public void setBoardTime(String boardTime) {
		this.boardTime = boardTime;
	}

	public Timestamp getHireTime() {
		return hireTime;
	}

	public void setHireTime(Timestamp hireTime) {
		this.hireTime = hireTime;
	}

	public Timestamp getFireTime() {
		return fireTime;
	}

	public void setFireTime(Timestamp fireTime) {
		this.fireTime = fireTime;
	}

	public Timestamp getTranTime() {
		return tranTime;
	}

	public void setTranTime(Timestamp tranTime) {
		this.tranTime = tranTime;
	}

	public Short getEmployWay() {
		return employWay;
	}

	public void setEmployWay(Short employWay) {
		this.employWay = employWay;
	}

	public String getRecommendMan() {
		return recommendMan;
	}

	public void setRecommendMan(String recommendMan) {
		this.recommendMan = recommendMan;
	}

	public Integer getJobYears() {
		return jobYears;
	}

	public void setJobYears(Integer jobYears) {
		this.jobYears = jobYears;
	}

	public Short getEmployType() {
		return employType;
	}

	public void setEmployType(Short employType) {
		this.employType = employType;
	}

	public String getEmployTime() {
		return employTime;
	}

	public void setEmployTime(String employTime) {
		this.employTime = employTime;
	}

	public Short getIsPresentGraduate() {
		return isPresentGraduate;
	}

	public void setIsPresentGraduate(Short isPresentGraduate) {
		this.isPresentGraduate = isPresentGraduate;
	}

	public String getGraduateTime() {
		return graduateTime;
	}

	public void setGraduateTime(String graduateTime) {
		this.graduateTime = graduateTime;
	}

	public String getSchool() {
		return school;
	}

	public void setSchool(String school) {
		this.school = school;
	}

	public Short getEducation() {
		return education;
	}

	public void setEducation(Short education) {
		this.education = education;
	}

	public String getSpecialty() {
		return specialty;
	}

	public void setSpecialty(String specialty) {
		this.specialty = specialty;
	}

	public String getIsContract() {
		return isContract;
	}

	public void setIsContract(String isContract) {
		this.isContract = isContract;
	}

	public String getSignTime() {
		return signTime;
	}

	public void setSignTime(String signTime) {
		this.signTime = signTime;
	}

	public String getEignTime() {
		return eignTime;
	}

	public void setEignTime(String eignTime) {
		this.eignTime = eignTime;
	}

	public String getFignTime() {
		return fignTime;
	}

	public void setFignTime(String fignTime) {
		this.fignTime = fignTime;
	}

	public Integer getSignNum() {
		return signNum;
	}

	public void setSignNum(Integer signNum) {
		this.signNum = signNum;
	}

	public String getPreformNum() {
		return preformNum;
	}

	public void setPreformNum(String preformNum) {
		this.preformNum = preformNum;
	}

	public String getFormTime() {
		return formTime;
	}

	public void setFormTime(String formTime) {
		this.formTime = formTime;
	}

	public Short getIsInsurance() {
		return isInsurance;
	}

	public void setIsInsurance(Short isInsurance) {
		this.isInsurance = isInsurance;
	}

	public Short getInsuranceType() {
		return insuranceType;
	}

	public void setInsuranceType(Short insuranceType) {
		this.insuranceType = insuranceType;
	}

	public String getInsuranceTime() {
		return insuranceTime;
	}

	public void setInsuranceTime(String insuranceTime) {
		this.insuranceTime = insuranceTime;
	}

	public String getPensionNum() {
		return pensionNum;
	}

	public void setPensionNum(String pensionNum) {
		this.pensionNum = pensionNum;
	}

	public String getMedicalNum() {
		return medicalNum;
	}

	public void setMedicalNum(String medicalNum) {
		this.medicalNum = medicalNum;
	}

	public String getPublicNum() {
		return publicNum;
	}

	public void setPublicNum(String publicNum) {
		this.publicNum = publicNum;
	}

	public String getPalary() {
		return palary;
	}

	public void setPalary(String palary) {
		this.palary = palary;
	}

	public String getSalary() {
		return salary;
	}

	public void setSalary(String salary) {
		this.salary = salary;
	}

	public String getBank() {
		return bank;
	}

	public void setBank(String bank) {
		this.bank = bank;
	}

	public String getBankCardNum() {
		return bankCardNum;
	}

	public void setBankCardNum(String bankCardNum) {
		this.bankCardNum = bankCardNum;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public String getRank() {
		return rank;
	}

	public void setRank(String rank) {
		this.rank = rank;
	}

	public Short getForm() {
		return form;
	}

	public void setForm(Short form) {
		this.form = form;
	}

	public String getHometownPlace() {
		return hometownPlace;
	}

	public void setHometownPlace(String hometownPlace) {
		this.hometownPlace = hometownPlace;
	}

}