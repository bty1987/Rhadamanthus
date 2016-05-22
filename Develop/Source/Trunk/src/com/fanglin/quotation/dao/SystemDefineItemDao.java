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

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.quotation.po.SystemDefineItemPO;
import com.fanglin.utils.Paging;

public interface SystemDefineItemDao extends Dao<SystemDefineItemPO> {
	
	public List<SystemDefineItemPO> pageSystemDefineItem(Paging paging, List<FilterVO> filters);

	public SystemDefineItemPO querySystemDefineItemById(String itemId);
	
}
