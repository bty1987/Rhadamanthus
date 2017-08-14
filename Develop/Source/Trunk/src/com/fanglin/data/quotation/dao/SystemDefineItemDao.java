/**
 * @File Name		: SystemDefineItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.SystemDefineItemPO;
import com.fanglin.utils.Paging;

public interface SystemDefineItemDao extends Dao<SystemDefineItemPO> {
	
	public List<SystemDefineItemPO> pageSystemDefineItem(Paging paging, List<Filter> filters,int company);

	public SystemDefineItemPO querySystemDefineItemById(String itemId,int company);
	
}
