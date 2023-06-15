package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.vo.OccessoriesItemVO;

public interface OccessoriesItemService {

	public List<OccessoriesItemVO> queryOccessoriesItemByOid(OccessoriesItemVO occessoriesItemVO);

	public int addOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException;

	public int updateOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException;

	public int deleteOccessoriesItem(OccessoriesItemVO occessoriesItemVO) throws FLException;

}
