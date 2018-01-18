package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserBaseVO;
import com.fanglin.personel.vo.UserCompanyVO;

public interface UserCompanyService {

	public List<UserCompanyVO> queryUserCompany(UserBaseVO user) throws FLException;
	
	public int updateUserCompany(UserBaseVO userVO, List<String> cids)throws FLException;
	
}
