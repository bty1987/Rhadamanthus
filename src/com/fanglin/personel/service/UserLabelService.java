package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.personel.vo.UserLabelVO;


public interface UserLabelService {

	public List<UserLabelVO> queryUserLabelByUid(UserLabelVO userlabelVO);
	
	public List<UserLabelVO> pickUserLabel(List<Integer> userLabel);
	
	public void addUserLabel(UserLabelVO userlabelVO);
	
	public void deleteUserLabel(UserLabelVO userlabelVO);
	
}
