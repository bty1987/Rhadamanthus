/**
 * @File Name		: MaterialOutsideDao.java
 * @Package   	: com.fanglin.dao.materialOrder
 * @Version		: 1.0
 * @Date			: 2014-11-10
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.material.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.material.po.MaterialOutsidePO;
import com.fanglin.utils.Paging;

public interface MaterialOutsideDao extends Dao<MaterialOutsidePO>{
	
	public List<MaterialOutsidePO> pageMaterialOutside(Paging paging, List<FilterVO> filters);
	
}
