package com.fanglin.inventory.service;

import java.util.List;

import com.fanglin.core.interceptor.FLException;
import com.fanglin.inventory.po.AccessoriesPO;
import com.fanglin.inventory.vo.AccessoriesItemVO;
import com.fanglin.inventory.vo.AccessoriesVO;

public interface AccessoriesItemService {

	public List<AccessoriesItemVO> queryAccessoriesItemByAid(AccessoriesItemVO accessoriesItemVO);

	public List<AccessoriesItemVO> queryAccessoriesItemByAids(List<Long> aids);

	public List<AccessoriesItemVO> queryAccessoriesItemByOrderId(AccessoriesVO accessoriesVO);

	public long checkAccessoriesItem(AccessoriesVO accessoriesVO, AccessoriesItemVO accessoriesItemVO) throws FLException;

	public long amountAccessoriesCharge(AccessoriesPO accessoriesPO);

	public int addAccessoriesItem(AccessoriesVO accessoriesVO, AccessoriesItemVO accessoriesItemVO) throws FLException;

	public int updateAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException;

	public int deleteAccessoriesItem(AccessoriesItemVO accessoriesItemVO) throws FLException;

}
