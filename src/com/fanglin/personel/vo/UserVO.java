/**
 * Title: UserVO
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.vo;

import java.io.Serializable;
import java.sql.Timestamp;
import java.util.Arrays;

import com.fanglin.core.security.SensitiveDataHelper;

import com.fanglin.communion.vo.DepartmentVO;
import com.fanglin.communion.vo.DutyVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.system.vo.RoleVO;
import com.fanglin.utils.BeanUtil;

public class UserVO implements Serializable {

	private static final long serialVersionUID = -7041891388073738568L;

	private Integer uid;

	private String userId;

	private String loginId;

	private String oldUserId;

	private String userName;

	private String currentName;

	private String pinYin;

	private RoleVO role;

	private DepartmentVO dept;

	private String dutyName;

	private DutyVO duty;

	private String password;

	private String gender;

	private String identity;

	private String phone;

	private String userPhoto;

	private String identityPathF;

	private String identityPathB;

	private Short isLogin;

	private Short isPrefor;

	private Short extranet;

	private Short freedom;

	private Short status;

	private Short isUpdate;

	private String companyNo;

	private String companys;

	private Short authStatus;

	private String authUrl;

	private String signNo;

	private String token;

	private Timestamp operateTime;

	public UserVO() {
		super();
	}

	public UserVO(String userId) {
		super();
		setUserId(userId);
	}

	public UserVO(DutyVO duty) {
		super();
		this.duty = duty;
	}

	public UserVO(String userId, String userName, String currentName, RoleVO role) {
		super();
		this.userId = userId;
		this.role = role;
		this.userName = userName;
		this.currentName = currentName;
	}

	public UserVO(RoleVO role, DepartmentVO dept, DutyVO duty) {
		super();
		this.role = role;
		this.dept = dept;
		this.duty = duty;
	}

	public Integer getUid() {
		return uid;
	}

	public void setUid(Integer uid) {
		this.uid = uid;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getOldUserId() {
		return oldUserId;
	}

	public void setOldUserId(String oldUserId) {
		this.oldUserId = oldUserId;
	}

	public RoleVO getRole() {
		return role;
	}

	public void setRole(RoleVO role) {
		this.role = role;
	}

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}

	public String getLoginId() {
		return loginId;
	}

	public void setLoginId(String loginId) {
		this.loginId = loginId;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getPinYin() {
		return pinYin;
	}

	public void setPinYin(String pinYin) {
		this.pinYin = pinYin;
	}

	public String getCurrentName() {
		return currentName;
	}

	public void setCurrentName(String currentName) {
		this.currentName = currentName;
	}

	public Short getStatus() {
		return status;
	}

	public void setStatus(Short status) {
		this.status = status;
	}

	public DutyVO getDuty() {
		return duty;
	}

	public void setDuty(DutyVO duty) {
		this.duty = duty;
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

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getUserPhoto() {
		return userPhoto;
	}

	public void setUserPhoto(String userPhoto) {
		this.userPhoto = userPhoto;
	}

	public Short getIsLogin() {
		return isLogin;
	}

	public void setIsLogin(Short isLogin) {
		this.isLogin = isLogin;
	}

	public Short getIsPrefor() {
		return isPrefor;
	}

	public void setIsPrefor(Short isPrefor) {
		this.isPrefor = isPrefor;
	}

	public Short getExtranet() {
		return extranet;
	}

	public void setExtranet(Short extranet) {
		this.extranet = extranet;
	}

	public Short getFreedom() {
		return freedom;
	}

	public void setFreedom(Short freedom) {
		this.freedom = freedom;
	}

	public String getCompanys() {
		return companys;
	}

	public void setDutyName(String dutyName) {
		this.dutyName = dutyName;
	}

	public Short getIsUpdate() {
		return isUpdate;
	}

	public void setIsUpdate(Short isUpdate) {
		this.isUpdate = isUpdate;
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

	public String getCompanyNo() {
		return companyNo;
	}

	public void setCompanyNo(String companyNo) {
		this.companyNo = companyNo;
	}

	public void setCompanys(String companys) {
		this.companys = companys;
	}

	public String getDutyName() {
		return dutyName;
	}

	public Short getAuthStatus() {
		return authStatus;
	}

	public void setAuthStatus(Short authStatus) {
		this.authStatus = authStatus;
	}

	public String getAuthUrl() {
		return authUrl;
	}

	public void setAuthUrl(String authUrl) {
		this.authUrl = authUrl;
	}

	public String getSignNo() {
		return signNo;
	}

	public void setSignNo(String signNo) {
		this.signNo = signNo;
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public Timestamp getOperateTime() {
		return operateTime;
	}

	public void setOperateTime(Timestamp operateTime) {
		this.operateTime = operateTime;
	}

	public UserVO setBaseInfo(UserPO userPO) {

		if (userPO == null) return this;

		setUid(userPO.getUid());
		setUserId(userPO.getUserId());
		setCurrentName(userPO.getCurrentName());
		setUserName(userPO.getUserName());
		setUserPhoto(userPO.getUserPhoto());
		setPhone(userPO.getPhone());
		setDutyName(userPO.getDuty().getName());

		return this;
	}

	public UserVO ptv(UserPO userPO) {

		if (userPO == null) return this;

		BeanUtil.copyProperties(userPO, this, Arrays.asList("role", "dept", "duty", "password", "identity", "company"));
		BeanUtil.copyProperties(userPO.getDuty(), getDuty(), Arrays.asList("departmentType"));
		BeanUtil.copyProperties(userPO.getDept(), getDept(), Arrays.asList("fatherDept", "type", "manager"));

		setPhone(SensitiveDataHelper.decrypt(userPO.getPhone()));
		setIdentity(SensitiveDataHelper.decrypt(userPO.getIdentity()));

		return this;
	}

}
