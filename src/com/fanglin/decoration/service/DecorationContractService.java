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

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Authentication;
import com.fanglin.decoration.vo.DecorationContractVO;

public interface DecorationContractService {
	
	public DecorationContractVO queryDecorationContractByOrderId(DecorationContractVO decorationContractVO) throws FLException;

	public DecorationContractVO queryDecorationContractForQuotationByOrderId(DecorationContractVO decorationContractVO) throws FLException;
	
	public int saveDecorationContract(DecorationContractVO decorationContractVO, int company) throws FLException;
	
	public int signDecorationContract(DecorationContractVO decorationContractVO, Authentication authentication) throws FLException;
	
	public int resignDecorationContract(DecorationContractVO decorationContractVO, String userId) throws FLException;
	
}
