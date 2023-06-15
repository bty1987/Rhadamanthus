package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.communion.vo.CustomerVO;
import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.data.common.vo.ContractVO;
import com.fanglin.data.common.vo.SignetVO;
import com.fanglin.decoration.vo.DecorationContractVO;
import com.fanglin.decoration.vo.DecorationVO;

public interface DecorationContractService {

	public List<DecorationContractVO> queryDecorationContractByOrderId(DecorationContractVO decorationContract) throws FLException;

	public void sendDecorationContractForAuth(DecorationContractVO decorationContractVO) throws FLException;

	public void sendDecorationContract(DecorationContractVO decorationContractVO) throws FLException;

	public String redirectDecorationContract(DecorationContractVO decorationContractVO) throws FLException;

	public String viewDecorationContract(DecorationContractVO decorationContractVO) throws FLException;

	public int addDecorationContract(DecorationContractVO decorationContractVO, ContractVO contractVO, String data, String table, String userId) throws FLException;

	public String signDecorationContractForCompany(SignetVO signetVO, DecorationContractVO decorationContractVO) throws FLException;

	public String signDecorationContractForCustomer(DecorationContractVO decorationContractVO, CustomerVO customerVO) throws FLException;

	public int affixDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException;

	public int expireDecorationContract(DecorationContractVO decorationContractVO) throws FLException;

	public int filingDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException;

	public int showDecorationContract(DecorationContractVO decorationContractVO) throws FLException;

	public int signDecorationContract(DecorationVO decorationVO, Authentication authentication) throws FLException;

	public int resignDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException;

	public int presignDecorationContract(DecorationVO decoration, String userId) throws FLException;

}
