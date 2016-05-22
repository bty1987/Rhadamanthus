/**
 * @File Name		: QuotationItemDao.java
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
import com.fanglin.quotation.po.QuotationItemPO;
import com.fanglin.utils.Paging;

public interface QuotationItemDao extends Dao<QuotationItemPO> {
	
	public List<QuotationItemPO> pageQuotationItem(Paging paging, List<FilterVO> filters);
	
	public List<QuotationItemPO> queryQuotationItemByIds(List<Long> ids);

	public QuotationItemPO queryQuotationItemByIdAVersionId(String itemId, String versionId);
	
	public void copyQuotaitonItem(String sourceVersionId, String newVersionId);
	
}
