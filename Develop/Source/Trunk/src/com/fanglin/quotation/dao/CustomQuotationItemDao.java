/**
 * @File Name		: CustomQuotationItemDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.quotation.po.CustomQuotationItemPO;
import com.fanglin.utils.Paging;

public interface CustomQuotationItemDao extends Dao<CustomQuotationItemPO> {
	
	public List<CustomQuotationItemPO> getAllCustomQuotationItemsByFunctionAreaId(long functionAreaId);

	public List<CustomQuotationItemPO> getPageCustomQuotationItemsByQuotationId(Paging paging, List<FilterVO> filters, Long quotationId);
	
	public List<CustomQuotationItemPO> queryCustomQuotationItemByFunctionAreaIds(List<Long> functionAreaIds);
	
	public int deleteCustomQuotationItemByFunctionAreaId(long functionAreaId);
	
	public int deleteCustomQuotationItemByitemIds(List<String> itemIds);
	
	public int deleteCustomQuotationItemByIds(List<Long> autoIds);
	
}
