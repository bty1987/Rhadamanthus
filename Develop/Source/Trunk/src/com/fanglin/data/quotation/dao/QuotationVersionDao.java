/**
 * @File Name		: QuotationVersionDao.java
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-7-25
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao;

import java.util.List;

import com.fanglin.core.dao.Dao;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.data.po.QuotationVersionPO;
import com.fanglin.utils.Paging;

public interface QuotationVersionDao extends Dao<QuotationVersionPO> {
	
	public List<QuotationVersionPO> pageQuotationVersion(Paging paging, List<FilterVO> filters);
	
	public List<QuotationVersionPO> queryQuotationVersionByDefaultFlag(int defaultFlag);

	public List<QuotationVersionPO> queryQuotationVersion();
	
	public QuotationVersionPO queryQuotationVersionByVersionId(String versionId);

}
