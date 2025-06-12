package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.personel.vo.UserPartnerVO;

public interface UserPartnerService {

	public List<UserPartnerVO> queryUserPartner(UserPartnerVO userPartnerVO) throws FLException;

	public int addUserPartner(UserPartnerVO userPartnerVO, int company) throws FLException;

	public int deleteUserPartner(UserPartnerVO userPartnerVO) throws FLException;

}
