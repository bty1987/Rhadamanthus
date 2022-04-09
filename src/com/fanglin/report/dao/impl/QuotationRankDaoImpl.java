/**
 * @File Name		: DecorationDesignerRankDaoImpl.java
 * @Package   	: com.fanglin.report.dao.impl
 * @Version		: 1.0
 * @Date			: 2015-6-23
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */
package com.fanglin.report.dao.impl;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.quotation.po.AddReducePO;
import com.fanglin.report.dao.QuotationRankDao;

@Repository("quotationRankDao")
public class QuotationRankDaoImpl extends DaoImpl<AddReducePO> implements QuotationRankDao {

	public QuotationRankDaoImpl() {
		super(AddReducePO.class);
	}

	@Override
	public List<?> rankAddReduce(int company) {

		String sql = "select t.name as name,t.count as count,t.total as total from (select sv.currentname as name, count(ar.arid) as `count`, sum(ar.total) as `total`  from quotation.addreduce ar, decoration.decoration d, communion.user sv where ar.orderId = d.orderId and d.svuid = sv.uid and d.company = :companyA and ar.status in (0, 1) group by sv.uid) t order by t.count desc limit 10";

		return session().createSQLQuery(sql).setInteger("companyA", company).list();
	}

}
