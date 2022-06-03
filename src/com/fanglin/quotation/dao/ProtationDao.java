/**
 * @File Name		: ProtationDao.java
 * @Package   	: com.fanglin.quotation.dao
 * @Version		: 1.0
 * @Date			: 2021-9-19
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.Filter;
import com.fanglin.quotation.po.ProtationDO;
import com.fanglin.quotation.po.ProtationPO;
import com.fanglin.utils.Paging;

public interface ProtationDao extends Dao<ProtationPO> {

	public List<ProtationDO> pageProtation(Paging paging, List<Filter> filters, Integer company);

	public List<ProtationPO> queryProtationByOrderId(String orderId);

	public ProtationPO queryProtationForDefaultByOrderId(String orderId);

	public int countProtationByOrderId(String orderId);

	public int clearProtationForDefaultByOrderId(String orderId);

}
