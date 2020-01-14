/**
 * @File Name		: DecorationContractService
 * @Package   	: com.fanglin.service.decoration;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.communion.vo.SignetVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationContractService {

	public List<DecorationContractVO> queryDecorationContractByOrderId(DecorationContractVO decorationContract) throws FLException;

	public int addDecorationContract(DecorationContractVO decorationContract, String userId) throws FLException;

	public int signDecorationContract(DecorationContractVO decorationContractVO, Authentication authentication) throws FLException;

	public int resignDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException;

	public int presignDecorationContract(DecorationVO decoration, String userId) throws FLException;

	public int signDecorationContractForCompany(SignetVO signetVO, DecorationContractVO decorationContractVO) throws FLException;

	public String signDecorationContractForCustomer(DecorationContractVO decorationContractVO, CustomerVO customerVO) throws FLException;

	public String viewDecorationContract(DecorationContractVO decorationContractVO) throws FLException;

	public int fillingDecorationContract(DecorationContractVO decorationContractVO) throws FLException;
}
