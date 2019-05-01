/**
 * @File Name		: StorehouseDao.java
 * @Package   	: com.fanglin.inventory.dao
 * @Version		: 1.0
 * @Date			: 2016-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.inventory.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.inventory.po.StorehousePO;
import com.fanglin.utils.Paging;

public interface StorehouseDao extends Dao<StorehousePO> {

	public List<StorehousePO> pageStorehouse(Paging paging, List<Filter> filters);

	public List<StorehousePO> queryStorehouse(List<Filter> filters);

	public StorehousePO queryStroehouseByCode(String code);

}
