/**
 * @File Name		: QuotationItemDaoImpl.java
 * @Package   	: com.fanglin.dao.impl
 * @Version		: 1.0
 * @Date			: 2014-7-24
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email			: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.data.quotation.dao.impl;

import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.data.po.QuotationItemPO;
import com.fanglin.data.quotation.dao.QuotationItemDao;
import com.fanglin.utils.Paging;

@Repository("quotationItemDao")
public class QuotationItemDaoImpl extends DaoImpl<QuotationItemPO> implements QuotationItemDao {
	
	public QuotationItemDaoImpl(){
		super(QuotationItemPO.class);
	}

	@Override
	public List<QuotationItemPO> pageQuotationItem(Paging paging, List<Filter> filters){
		
		PagingQuery<QuotationItemPO> query = pagingQuery(paging, QuotationItemPO.class);
		
		queryFilterExcute(query, filters);
		
		query.asc("itemId");
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<QuotationItemPO> queryQuotationItemByIds(List<Long> ids){
		return session().createCriteria(QuotationItemPO.class).add(Restrictions.in("autoId", ids)).list();
	}

	@Override
	public QuotationItemPO queryQuotationItemByIdAVersionId(String itemId,String versionId){
		return (QuotationItemPO)session().createCriteria(QuotationItemPO.class)
				.add(Restrictions.eq("itemId", itemId))
				.add(Restrictions.eq("quotationVersion.no", versionId))
				.add(Restrictions.eq("status", QuotationItemPO.STATUS_ENABLE_INT))
				.uniqueResult();
	}
	
	@Override
	public void copyQuotaitonItem(String sourceVersionId, String newVersionId){
		
		StringBuffer sql = new StringBuffer();
		sql.append("insert into quotation.quotationItem (itemId,versionId,quotationTypeId,quotationClassificationId,quotationBigCategoryId,quotationSmallCategoryId,itemName,measurementUnitId,itemWorkTypeId,quotationItemDes,unitPrice) ");
		sql.append("select itemId,'");
		sql.append(newVersionId);
		sql.append("',quotationTypeId,quotationClassificationId,quotationBigCategoryId,quotationSmallCategoryId,itemName,measurementUnitId,itemWorkTypeId,quotationItemDes,unitPrice from quotation.quotationItem where versionId='");
		sql.append(sourceVersionId);
		sql.append("'");
	  
	    session().createSQLQuery(sql.toString()).executeUpdate();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		if(filters != null){
			for(Filter filter: filters){
				if("status".equals(filter.getField())){
					query.add(query.getCriterion("status", Short.parseShort(filter.getData()), filter.getOp()));
				}else if("quotationTypeId".equals(filter.getField())){
					query.add(query.getCriterion("quotationType.id", Integer.parseInt(filter.getData()), filter.getOp()));
				}else if("quotationClassificationId".equals(filter.getField())){
					query.add(query.getCriterion("quotationClassification.id", Integer.parseInt(filter.getData()), filter.getOp()));
				}else if("quotationBigCategoryId".equals(filter.getField())){
					query.add(query.getCriterion("quotationBigCategory.id", Integer.parseInt(filter.getData()), filter.getOp()));
				}else if("quotationSmallCategoryId".equals(filter.getField())){
					query.add(query.getCriterion("quotationSmallCategory.id", Integer.parseInt(filter.getData()), filter.getOp()));
				}else if("versionId".equals(filter.getField())){
					query.add(query.getCriterion("quotationVersion.no", (filter.getData()), filter.getOp()));
				}else if("quotationWorkTypeId".equals(filter.getField())){
					query.add(query.getCriterion("workType.id", Integer.parseInt(filter.getData()), filter.getOp()));
				}else if("company".equals(filter.getField())){
					query.alias("quotationVersion", "quotationVersion");
					query.add(query.getCriterion("quotationVersion.company", Integer.parseInt(filter.getData()), filter.getOp()));
				}else{
					query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
				}
			}
		}
	}

}
