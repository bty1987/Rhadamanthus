/**
 * @File Name		: QuotationBigCategoryDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.dao.QuotationBigCategoryDao;
import com.fanglin.quotation.po.QuotationBigCategoryPO;

@Repository("quotationbigcategory")
public class QuotationBigCategoryDaoImpl extends DaoImpl<QuotationBigCategoryPO> implements QuotationBigCategoryDao {

	public QuotationBigCategoryDaoImpl(){
		super(QuotationBigCategoryPO.class, true);
	}

}
