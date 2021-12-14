/**
 * @File Name		: ProtationItemService.java
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
import com.fanglin.quotation.vo.ProtationItemVO;
import com.fanglin.quotation.vo.ProtationVO;

public interface ProtationItemService {

	public List<ProtationItemVO> queryProtationItemByPid(ProtationItemVO protationItemVO);

	public ProtationItemVO updateProtationItem(ProtationVO protationVO, ProtationItemVO protationItemVO) throws FLException;

	public int deleteProtationItem(ProtationVO protationVO, ProtationItemVO protationItemVO) throws FLException;

}
