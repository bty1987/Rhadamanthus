/**
 * Title: UserPO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.po;

import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.fanglin.department.po.DepartmentPO;
import com.fanglin.system.po.RolePO;

@Entity
@Table(name = "user", catalog = "communion")
public class UserPO implements Serializable {

	private static final long serialVersionUID = -7041891388073738568L;
	
	public static final String SUPER_USERID_STR = "1";
	
	public static final short ISLOGIN_NOT_INT = 0;
	
	public static final short ISLOGIN_FIP_INT = 1;
	
	public static final short ISLOGIN_FS_INT = 2;
	
	private int uId;

	private String userId;
	
	private String oldUserId;
	
	private RolePO role;
	
	private int company;
	
	private DepartmentPO dept;
	
	private String loginId;
	
	private String password;
	
	private String userName;
	
	private String userNamePinYin;
	
	private String currentName;
	
	private String status;
	
	private Timestamp statusUpdateTime;
	
	private String deptType;
	
	private String duty;
	
	private String employWay;
	
	private String recommendMan;
	
	private Integer jobYears;
	
	private String employType;
	
	private String entryTime;
	
	private String employTime;
	
	private Integer serviceYears;
	
	private String gender;
	
	private String birthday;
	
	private Integer age;
	
	private String political;
	
	private String identity;
	
	private String phone;
	
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
	
	private Float salary;
	
	private String lover;
	
	private String bank;
	
	private String bankCardNum;
	
	private String qq;
	
	private String wechat;
	
	private String email;
	
	private String userPhoto;
	
	private short isLogin;
	
	private short extranet;

	public UserPO(){
		
	}
	
	public UserPO(String userId){
		this.userId = userId;
	}
	
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "uId") 
	public int getUId() {
		return uId;
	}

	public void setUId(int uId) {
		this.uId = uId;
	}

	@Id
	public String getUserId(){
		return userId;
	}

	public void setUserId(String userId){
		this.userId = userId;
	}

    public String getOldUserId(){
        return oldUserId;
    }
   
    public void setOldUserId(String oldUserId){
        this.oldUserId = oldUserId;
    }
    
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "roleId", referencedColumnName = "roleId", nullable = false)
	public RolePO getRole(){
		return role;
	}

	public void setRole(RolePO role){
		this.role = role;
	}

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "deptId", referencedColumnName = "deptId", nullable = false)
	public DepartmentPO getDept(){
		return dept;
	}
	
	public void setDept(DepartmentPO dept){
		this.dept = dept;
	}

	public String getLoginId(){
		return loginId;
	}

	public void setLoginId(String loginId){
		this.loginId = loginId;
	}

	public String getPassword(){
		return password;
	}

	public void setPassword(String password){
		this.password = password;
	}

	public String getUserName(){
		return userName;
	}

	public void setUserName(String userName){
		this.userName = userName;
	}

	public String getUserNamePinYin(){
		return userNamePinYin;
	}

	public void setUserNamePinYin(String userNamePinYin){
		this.userNamePinYin = userNamePinYin;
	}

	public String getCurrentName(){
		return currentName;
	}

	public void setCurrentName(String currentName){
		this.currentName = currentName;
	}

	public String getStatus(){
		return status;
	}

	public void setStatus(String status){
		this.status = status;
	}

	public Timestamp getStatusUpdateTime(){
		return statusUpdateTime;
	}

	public void setStatusUpdateTime(Timestamp statusUpdateTime){
		this.statusUpdateTime = statusUpdateTime;
	}

    public String getDeptType(){
        return deptType;
    }
    
    public void setDeptType(String deptType){
        this.deptType = deptType;
    }
    
	public String getDuty(){
		return duty;
	}

	public void setDuty(String duty){
		this.duty = duty;
	}

	public String getEmployWay(){
		return employWay;
	}

	public void setEmployWay(String employWay){
		this.employWay = employWay;
	}

	public String getRecommendMan(){
		return recommendMan;
	}

	public void setRecommendMan(String recommendMan){
		this.recommendMan = recommendMan;
	}

	public Integer getJobYears(){
		return jobYears;
	}

	public void setJobYears(Integer jobYears){
		this.jobYears = jobYears;
	}

	public String getEmployType(){
		return employType;
	}

	public void setEmployType(String employType){
		this.employType = employType;
	}

	public String getEntryTime(){
		return entryTime;
	}

	public void setEntryTime(String entryTime){
		this.entryTime = entryTime;
	}

	public String getEmployTime(){
		return employTime;
	}

	public void setEmployTime(String employTime){
		this.employTime = employTime;
	}

	public Integer getServiceYears(){
		return serviceYears;
	}

	public void setServiceYears(Integer serviceYears){
		this.serviceYears = serviceYears;
	}

	public String getGender(){
		return gender;
	}

	public void setGender(String gender){
		this.gender = gender;
	}

	public String getBirthday(){
		return birthday;
	}

	public void setBirthday(String birthday){
		this.birthday = birthday;
	}

	public Integer getAge(){
		return age;
	}

	public void setAge(Integer age){
		this.age = age;
	}

	public String getPolitical(){
		return political;
	}

	public void setPolitical(String political){
		this.political = political;
	}

	public String getIdentity(){
		return identity;
	}

	public void setIdentity(String identity){
		this.identity = identity;
	}

	public String getPhone(){
		return phone;
	}

	public void setPhone(String phone){
		this.phone = phone;
	}

	public String getEmergencyMan(){
		return emergencyMan;
	}

	public void setEmergencyMan(String emergencyMan){
		this.emergencyMan = emergencyMan;
	}

	public String getEmergencyPhone(){
		return emergencyPhone;
	}

	public void setEmergencyPhone(String emergencyPhone){
		this.emergencyPhone = emergencyPhone;
	}

	public String getIsPresentGraduate(){
		return isPresentGraduate;
	}

	public void setIsPresentGraduate(String isPresentGraduate){
		this.isPresentGraduate = isPresentGraduate;
	}

	public String getGraduateTime(){
		return graduateTime;
	}

	public void setGraduateTime(String graduateTime){
		this.graduateTime = graduateTime;
	}

	public String getSchool(){
		return school;
	}

	public void setSchool(String school){
		this.school = school;
	}

	public String getEducation(){
		return education;
	}

	public void setEducation(String education){
		this.education = education;
	}

	public String getSpecialty(){
		return specialty;
	}

	public void setSpecialty(String specialty){
		this.specialty = specialty;
	}

	public String getIsMarried(){
		return isMarried;
	}

	public void setIsMarried(String isMarried){
		this.isMarried = isMarried;
	}

	public String getIsBirth(){
		return isBirth;
	}

	public void setIsBirth(String isBirth){
		this.isBirth = isBirth;
	}

	public String getIsHouseLoan(){
		return isHouseLoan;
	}

	public void setIsHouseLoan(String isHouseLoan){
		this.isHouseLoan = isHouseLoan;
	}

	public String getIsCarLoan(){
		return isCarLoan;
	}

	public void setIsCarLoan(String isCarLoan){
		this.isCarLoan = isCarLoan;
	}

	public String getHouseType(){
		return houseType;
	}

	public void setHouseType(String houseType){
		this.houseType = houseType;
	}

	public String getHouseholdType(){
		return householdType;
	}

	public void setHouseholdType(String householdType){
		this.householdType = householdType;
	}

	public String getHometownAddress(){
		return hometownAddress;
	}

	public void setHometownAddress(String hometownAddress){
		this.hometownAddress = hometownAddress;
	}

	public String getAddress(){
		return address;
	}

	public void setAddress(String address){
		this.address = address;
	}

	public String getIsContract(){
		return isContract;
	}

	public void setIsContract(String isContract){
		this.isContract = isContract;
	}

	public String getIsInsurance(){
		return isInsurance;
	}

	public void setIsInsurance(String isInsurance){
		this.isInsurance = isInsurance;
	}

	public String getInsuranceTime(){
		return insuranceTime;
	}

	public void setInsuranceTime(String insuranceTime){
		this.insuranceTime = insuranceTime;
	}

	public String getPensionNum(){
		return pensionNum;
	}

	public void setPensionNum(String pensionNum){
		this.pensionNum = pensionNum;
	}

	public String getMedicalNum(){
		return medicalNum;
	}

	public void setMedicalNum(String medicalNum){
		this.medicalNum = medicalNum;
	}

	public Float getSalary(){
		return salary;
	}

	public void setSalary(Float salary){
		this.salary = salary;
	}

	public String getLover(){
		return lover;
	}

	public void setLover(String lover){
		this.lover = lover;
	}

	public String getBank(){
		return bank;
	}

	public void setBank(String bank){
		this.bank = bank;
	}

	public String getBankCardNum(){
		return bankCardNum;
	}

	public void setBankCardNum(String bankCardNum){
		this.bankCardNum = bankCardNum;
	}

	public String getQq(){
		return qq;
	}

	public void setQq(String qq){
		this.qq = qq;
	}

	public String getWechat(){
		return wechat;
	}

	public void setWechat(String wechat){
		this.wechat = wechat;
	}

	public String getEmail(){
		return email;
	}

	public void setEmail(String email){
		this.email = email;
	}

	public String getUserPhoto(){
		return userPhoto;
	}

	public void setUserPhoto(String userPhoto){
		this.userPhoto = userPhoto;
	}

    public short getIsLogin(){
        return isLogin;
    }

    public void setIsLogin(short isLogin){
        this.isLogin = isLogin;
    }

	public int getCompany() {
		return company;
	}

	public void setCompany(int company) {
		this.company = company;
	}

	public short getExtranet() {
		return extranet;
	}

	public void setExtranet(short extranet) {
		this.extranet = extranet;
	}

}
