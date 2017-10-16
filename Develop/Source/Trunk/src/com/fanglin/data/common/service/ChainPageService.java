package com.fanglin.data.common.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.data.common.vo.ChainPageVO;

public  interface ChainPageService {
	
	public List<ChainPageVO> queryChainPage();
	
	public List<ChainPageVO> queryChainPageForSelf(String roleId)throws FLException ;

	public void addChainPage(ChainPageVO chainPageVO) throws FLException;
	
	public void deleteChainPage(ChainPageVO chainPageVO) throws FLException ;
}
