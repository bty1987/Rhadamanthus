/**
 * Title: UserContractService
 * Description:
 * Copyright: Copyright (c) 2013 All rights reserved.
 * Company: BTY
 * @author bty1987
 *
 */

package com.fanglin.personel.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.personel.vo.UserContractVO;

public interface UserContractService {

	public List<UserContractVO> queryUserContract(UserContractVO userContractVO);

	public void sendUserContractForAuth(UserContractVO userContractVO) throws FLException;

	public void sendUserContract(UserContractVO userContractVO) throws FLException;

	public String redirectUserContract(UserContractVO userContractVO) throws FLException;

	public String viewUserContract(UserContractVO userContractVO) throws FLException;

	public String signUserContractForCompany(SignetVO signetVO, UserContractVO userContractVO) throws FLException;

	public String signUserContractForUser(UserContractVO userContractVO) throws FLException;

	public int addUserContract(UserContractVO userContractVO, ContractVO contractVO, String data, String userId) throws FLException;

	public int updateUserContract(UserContractVO userContractVO) throws FLException;

	public int affixUserContract(UserContractVO userContractVO) throws FLException;

	public int expireUserContract(UserContractVO userContractVO) throws FLException;

	public int filingUserContract(UserContractVO userContractVO) throws FLException;

	public int deleteUserContract(UserContractVO userContractVO) throws FLException;

}
