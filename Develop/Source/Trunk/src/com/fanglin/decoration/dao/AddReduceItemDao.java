/**
 * @File Name		: AddReduceItemDao.java
 * @Package   	: com.fanglin.decoration.dao
 * @Version		: 1.0
 * @Date			: 2016-6-11
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.decoration.po.AddReduceItemPO;
import com.fanglin.utils.Paging;

public interface AddReduceItemDao extends Dao<AddReduceItemPO> {
	
	public List<AddReduceItemPO> pageAddReduceItem(Paging paging, List<Filter> filters);
	
	public List<AddReduceItemPO> pageAddReduceItemByAddReduceId(Paging paging, List<Filter> filters, int arId);
	
	public List<AddReduceItemPO> queryAddReduceItemByAddReduceId(int addReduceId);
	
	public List<AddReduceItemPO> queryAddReduceItemByAddReduceIds(List<Integer> addReduceIds);
	
	public int deleteAddReductItemByAddReduceId(int addReduceId);

}
