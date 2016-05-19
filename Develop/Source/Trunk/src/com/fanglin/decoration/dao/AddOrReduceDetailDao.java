/**
 * @File Name		: AddOrReduceDetailDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.decoration.po.AddOrReduceDetailPO;
import com.fanglin.utils.Paging;

public interface AddOrReduceDetailDao extends Dao<AddOrReduceDetailPO> {
	
	public List<AddOrReduceDetailPO> pageAddOrReduceDetail(Paging paging, List<FilterVO> filters);
	
	public List<AddOrReduceDetailPO> pageAddOrReduceDetailById(Paging paging, List<FilterVO> filters, int arId);
	
	public List<AddOrReduceDetailPO> queryAddOrReduceDetailById(int addOrReduceId);

	public int deleteAddOrReduceDetailById(int addOrReduceId);
	
}
