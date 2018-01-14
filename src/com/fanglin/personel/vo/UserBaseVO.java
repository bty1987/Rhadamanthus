package com.fanglin.personel.vo;

import java.io.Serializable;
import java.util.Arrays;

import com.fanglin.data.common.vo.DutyVO;
import com.fanglin.department.vo.DepartmentVO;
import com.fanglin.personel.po.UserPO;
import com.fanglin.utils.BeanUtil;



public class UserBaseVO implements Serializable {

	private static final long serialVersionUID = 5842754031939675421L;
	
	private Integer uid;

	private String userId;
	
	private String oldUserId;
	
	private String userName;
	
	private String currentName;
	
	private DutyVO duty;
	
	private String phone;
	
	private String userPhoto;
	
	private DepartmentVO dept;
	
	private String dutyName;
	
	public UserBaseVO() {
		super();
	}

	public UserBaseVO(String userId) {
		super();
		this.userId = userId;
	}

	public UserBaseVO(DutyVO duty) {
		super();
		this.duty = duty;
	}

	public UserBaseVO(DutyVO duty, DepartmentVO dept) {
		super();
		this.duty = duty;
		this.dept = dept;
	}

	public UserBaseVO(String userId, String userName, String currentName) {
		super();
		this.userId = userId;
		this.userName = userName;
		this.currentName = currentName;
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

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getCurrentName() {
		return currentName;
	}

	public void setCurrentName(String currentName) {
		this.currentName = currentName;
	}

	public DutyVO getDuty() {
		return duty;
	}

	public void setDuty(DutyVO duty) {
		this.duty = duty;
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

	public DepartmentVO getDept() {
		return dept;
	}

	public void setDept(DepartmentVO dept) {
		this.dept = dept;
	}
	
	public String getDutyName() {
		return dutyName;
	}

	public void setDutyName(String dutyName) {
		this.dutyName = dutyName;
	}

	public UserBaseVO setBaseInfo(UserPO userPO){
		
		if(userPO != null){
			setUid(userPO.getUid());
			setUserId(userPO.getUserId());
			setCurrentName(userPO.getCurrentName());
			setUserName(userPO.getUserName());
			setUserPhoto(userPO.getUserPhoto());
			setPhone(userPO.getPhone());
			setDutyName(userPO.getDuty().getName());
		}
		
		return this;
	}
	
	private void vtp(UserPO userPO){
		BeanUtil.copyPropertie(this, userPO, Arrays.asList("duty","dept"));
	}
	
	public void vtpcascade(UserPO userPO){
		vtp(userPO);
		
		if(userPO.getDuty() != null && this.getDuty() != null){
			BeanUtil.copyPropertie(this.getDuty(), userPO.getDuty(), Arrays.asList("departmentType"));
		}
		
		if(userPO.getDept() != null && this.getDept() != null){
			BeanUtil.copyPropertie(this.getDept(), userPO.getDept(), Arrays.asList("type","fatherDept","cityProper"));
			
			if(userPO.getDept().getFatherDept() != null && this.getDept().getFatherDept() != null){
				BeanUtil.copyPropertie(this.getDept().getFatherDept(), userPO.getDept().getFatherDept(), Arrays.asList("type","fatherDept","cityProper"));
			}
		}
	}
	

}
