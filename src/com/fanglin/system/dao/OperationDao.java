/**
 * @File Name		: OperationDao.java
 * @Package   	: com.fanglin.system.dao
 * @Version		: 1.0
 * @Date			: 2016-4-21
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.system.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.system.po.OperationPO;
import com.fanglin.utils.Paging;

public interface OperationDao extends Dao<OperationPO> {
	
	public List<OperationPO> pageOperation(Paging paging, List<Filter> filters);
	
	public List<OperationPO> queryOperation();
	
	public OperationPO queryOperationByOperation(String operation);
	
}
