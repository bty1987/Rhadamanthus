/**
 * @File Name		: QuotationTypeDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.quotation.dao.QuotationTypeDao;
import com.fanglin.data.quotation.po.QuotationTypePO;

@Repository("quotationtype")
public class QuotationTypeDaoImpl extends DaoImpl<QuotationTypePO> implements QuotationTypeDao {

	public QuotationTypeDaoImpl(){
		super(QuotationTypePO.class, true);
	}
	
}
