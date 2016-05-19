/**
 * @File Name		: BackVisitService
 * @Package   	: com.fanglin.service.decorationOrder;
 * @Version		: 1.0
 * @Date			: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.decoration.service;

import java.util.List;

import com.fanglin.core.vo.FilterVO;
import com.fanglin.quotation.vo.CustomQuotationItemVO;
import com.fanglin.utils.Paging;

public interface CustomQuotationItemService {
	
	public void pageCustomerItemByQuotationId(Paging paging, List<FilterVO> filters, CustomQuotationItemVO customQuotationItemVO);

}
