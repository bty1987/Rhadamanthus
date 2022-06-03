/**
 * @File Name		: ProtationService.java
 * @Package   	: com.fanglin.quotation.service
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.vo.ProtationVO;
import com.fanglin.utils.Paging;

public interface ProtationService {

	public void pageProtation(Paging paging, List<Filter> filters, Integer company) throws FLException;

	public List<ProtationVO> queryProtationByOrderId(ProtationVO protationVO);

	public ProtationVO queryProtationForDefaultByOrderId(ProtationVO protationVO);

	public ProtationVO queryProtationByPid(ProtationVO protationVO);

	public int addProtation(ProtationVO protationVO, String userId, int company) throws FLException;

	public int updateProtation(ProtationVO protationVO) throws FLException;

	public int updateProtationForAdvance(ProtationVO protationVO) throws FLException;

	public int updateProtationForStatus(ProtationVO protationVO) throws FLException;

	public int changeProtationForDefault(ProtationVO protationVO) throws FLException;

	public int deleteProtation(ProtationVO protationVO) throws FLException;

	public int lockProtation(ProtationVO protationVO) throws FLException;

	public int unlockProtation(ProtationVO protationVO) throws FLException;
}
