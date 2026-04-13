package com.fanglin.communion.vo;

import java.io.Serializable;

import com.fanglin.communion.po.CustomerPO;

public class CustomerVO implements Serializable {

	private static final long serialVersionUID = -7469004001329405496L;

	private Long cid;

	private String no;

	private String name;

	private String gender;

	private String identity;

	private String officer;

	private String passport;

	private String passhkm;

	private String qq;

	private String wechat;

	private String email;

	private String career;

	private String address;

	private String relationshipType;

	private Short type;

	private Short status;

	private String photoPath;

	private String signPath;

	private String identityPathF;

	private String identityPathB;

	private String phone;

	private Integer company;

	/** @deprecated 迁移至 CustomerBankVO, 不再使用 */
	private String companyNo;

	/** @deprecated 迁移至 CustomerBankVO, 不再使用 */
	private String companyName;

	/** @deprecated 迁移至 CustomerBankVO, 不再使用 */
	private String companyAddr;

	/** @deprecated 迁移至 CustomerBankVO, 不再使用 */
	private String companyPhone;

	/** @deprecated 迁移至 CustomerBankVO, 不再使用 */
	private String companyBank;

	/** @deprecated 迁移至 CustomerBankVO, 不再使用 */
	private String companyBankno;

	public CustomerVO() {
		super();
	}

	public CustomerVO(String name, String phone) {
		super();
		this.name = name;
		this.phone = phone;
	}

	public CustomerVO(Long cid) {
		super();
		this.cid = cid;
	}

	public Long getCid() {
		return cid;
	}

	public void setCid(Long cid) {
		this.cid = cid;
	}

	public String getNo() {
		return no;
	}

	public void setNo(String no) {
		this.no = no;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	public String getOfficer() {
		return officer;
	}

	public void setOfficer(String officer) {
		this.officer = officer;
	}

	public String getPassport() {
		return passport;
	}

	public void setPassport(String passport) {
		this.passport = passport;
	}

	public String getPasshkm() {
		return passhkm;
	}

	public void setPasshkm(String passhkm) {
		this.passhkm = passhkm;
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

	public String getCareer() {
		return career;
	}

	public void setCareer(String career) {
		this.career = career;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getRelationshipType() {
		return relationshipType;
	}

	public void setRelationshipType(String relationshipType) {
		this.relationshipType = relationshipType;
	}

	public String getPhotoPath() {
		return photoPath;
	}

	public void setPhotoPath(String photoPath) {
		this.photoPath = photoPath;
	}

	public String getSignPath() {
		return signPath;
	}

	public void setSignPath(String signPath) {
		this.signPath = signPath;
	}

	public String getIdentityPathF() {
		return identityPathF;
	}

	public void setIdentityPathF(String identityPathF) {
		this.identityPathF = identityPathF;
	}

	public String getIdentityPathB() {
		return identityPathB;
	}

	public void setIdentityPathB(String identityPathB) {
		this.identityPathB = identityPathB;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public Integer getCompany() {
		return company;
	}

	public Short getType() {
		return type;
	}

	public void setType(Short type) {
		this.type = type;
	}

	public String getCompanyNo() {
		return companyNo;
	}

	public void setCompanyNo(String companyNo) {
		this.companyNo = companyNo;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getCompanyAddr() {
		return companyAddr;
	}

	public void setCompanyAddr(String companyAddr) {
		this.companyAddr = companyAddr;
	}

	public String getCompanyPhone() {
		return companyPhone;
	}

	public void setCompanyPhone(String companyPhone) {
		this.companyPhone = companyPhone;
	}

	public String getCompanyBank() {
		return companyBank;
	}

	public void setCompanyBank(String companyBank) {
		this.companyBank = companyBank;
	}

	public String getCompanyBankno() {
		return companyBankno;
	}

	public void setCompanyBankno(String companyBankno) {
		this.companyBankno = companyBankno;
	}

	public void setCompany(Integer company) {
		this.company = company;
	}

	public void setConfidentialInfo() {

		setPhone("");
		setCompanyPhone("");

		setEmail("");
		setQq("");
		setWechat("");

		setAddress("");
		setIdentity("");
		setPhotoPath("");
		setIdentityPathF("");
		setIdentityPathB("");

		setCompanyAddr("");
		setCompanyBank("");
		setCompanyBankno("");
		setCompanyName("");
		setCompanyNo("");
	}

	public CustomerVO initBank(CustomerPO customerPO) {

		setCompanyName(customerPO.getCompanyName());
		setCompanyBank(customerPO.getCompanyBank());
		setCompanyBankno(customerPO.getCompanyBankno());

		return this;
	}
}
