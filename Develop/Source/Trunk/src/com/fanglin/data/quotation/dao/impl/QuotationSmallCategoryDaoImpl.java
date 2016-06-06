/**
 * @File Name		: QuotationSmallCategoryDaoImpl.java
 * @Package   	: com.fanglin.vo
 * @Version		: 1.0
 * @Date			: 2014-7-29
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.data.quotation.dao.QuotationSmallCategoryDao;
import com.fanglin.data.quotation.po.QuotationSmallCategoryPO;

@Repository("quotationsmallcategory")
public class QuotationSmallCategoryDaoImpl extends DaoImpl<QuotationSmallCategoryPO> implements QuotationSmallCategoryDao {

	public QuotationSmallCategoryDaoImpl(){
		super(QuotationSmallCategoryPO.class, true);
	}

}
