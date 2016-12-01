/**
 * @File Name		: MaterialInsideDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-18
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.material.po.MaterialInsidePO;
import com.fanglin.utils.Paging;

public interface MaterialInsideDao extends Dao<MaterialInsidePO> {
	
	public List<MaterialInsidePO> pageMaterialInside(Paging paging, List<Filter> filters);

}
