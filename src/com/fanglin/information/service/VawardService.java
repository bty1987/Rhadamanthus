/**
 * @File Name		: VawardService.java
 * @Package   	: com.fanglin.information.service
 * @Version		: 1.0
 * @Date			: 2019-4-28
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.information.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.information.vo.VawardVO;

public interface VawardService {
	
	public List<VawardVO> queryVawardByNo(VawardVO vawardVO);
	
	public int addVaward(VawardVO vawardVO) throws FLException;
	
	public int deleteVaward(VawardVO vawardVO) throws FLException; 
	
	public List<?> countVaward();

}
