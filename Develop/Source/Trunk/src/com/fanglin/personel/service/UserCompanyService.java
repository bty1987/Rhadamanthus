package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserCompanyVO;
import com.fanglin.personel.vo.UserVO;

public interface UserCompanyService {

	public List<UserCompanyVO> queryUserCompany(UserVO userVO) throws FLException;
	
	public int updateUserCompany(UserVO userVO, List<String> cids)throws FLException;
	
}
