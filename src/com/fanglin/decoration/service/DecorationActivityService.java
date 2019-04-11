/**
 * @File Name		: DecorationActivityService.java
 * @Package   	: com.fanglin.decoration.service
 * @Version		: 1.0
 * @Date			: 2015-12-31
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.decoration.vo.DecorationActivityVO;

public interface DecorationActivityService {
	
	public List<DecorationActivityVO> queryDecorationActivityByOrderId(DecorationActivityVO decorationActivityVO);
	
	public int addDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException;
	
	public int deleteDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException;
	
	public int lockDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException;
	
	public int unlockDecorationActivity(DecorationActivityVO decorationActivityVO) throws FLException;

}
