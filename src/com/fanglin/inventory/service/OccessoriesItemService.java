package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.OccessoriesItemVO;
import com.fanglin.inventory.vo.OccessoriesVO;

public interface OccessoriesItemService {

	public List<OccessoriesItemVO> queryOccessoriesItemByAid(OccessoriesItemVO occessoriesItemVO);
	
	public int addOccessoriesItem(OccessoriesVO occessoriesVO,OccessoriesItemVO occessoriesItemVO) throws FLException;
	
	public int updateOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException;
	
	public int deleteOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException;

	public int refundOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException;

}
