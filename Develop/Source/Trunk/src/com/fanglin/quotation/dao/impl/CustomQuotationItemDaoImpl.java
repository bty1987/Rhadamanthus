/**
 * @File Name		: CustomQuotationItemDaoImpl
 * @Package   	: com.fanglin.dao.impl.decorationOrder
 * @Version		: 1.0
 * @Date			: 2014-10-02
 * @Copyright	: Copyright Creators 2014
 * @Author		: mzy
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.quotation.dao.impl;

import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.FilterVO;
import com.fanglin.quotation.dao.CustomQuotationItemDao;
import com.fanglin.quotation.po.CustomQuotationItemPO;
import com.fanglin.utils.Paging;

@Repository("customQuotationItemDao")
public class CustomQuotationItemDaoImpl extends DaoImpl<CustomQuotationItemPO> implements CustomQuotationItemDao {
	
	public CustomQuotationItemDaoImpl(){
		super(CustomQuotationItemPO.class);
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<CustomQuotationItemPO> getAllCustomQuotationItemsByFunctionAreaId(long functionAreaId){
		return createCriteria(CustomQuotationItemPO.class)
				.add(Restrictions.eq("quotationFunctionArea.autoId", functionAreaId))
				.add(Restrictions.ne("quotationClassification.id", -1))
				.add(Restrictions.ne("quotationBigCategory.id", -1))
				.add(Restrictions.ne("workType.id", -1))
				.addOrder(Order.asc("itemId"))
				.list();
	}

	@Override
	public List<CustomQuotationItemPO> getPageCustomQuotationItemsByQuotationId(Paging paging, List<FilterVO> filters,Long quotationId){
		
		PagingQuery<CustomQuotationItemPO> query = pagingQuery(paging, CustomQuotationItemPO.class);

		query.alias("quotationFunctionArea", "quotationFunctionArea");
		query.alias("quotationFunctionArea.quotation", "quotation");
		
		query.add(query.getCriterion("quotation.autoId", quotationId, "eq"));
		
		if(filters != null){

			for(FilterVO filter : filters){
				if(StringUtils.isNotEmpty(filter.getData())){
					if("quotationClassificationId".equals(filter.getField())){
						query.add(query.getCriterion("quotationClassification.id", Integer.parseInt(filter.getData()), filter.getOp()));
					}else{
						query.add(query.getCriterion("quotationClassification.id", -1, "ne"));
						if("quotationBigCategoryId".equals(filter.getField())){
							query.add(query.getCriterion("quotationBigCategory.id", Integer.parseInt(filter.getData()), filter.getOp()));
						}else{
							query.add(query.getCriterion("quotationBigCategory.id", -1, "ne"));
							 if("quotationWorkTypeId".equals(filter.getField())){
								 query.add(query.getCriterion("workType.id", Integer.parseInt(filter.getData()), filter.getOp()));
							}else{
								query.add(query.getCriterion("workType.id", -1, "ne"));
								query.add(query.getCriterion(filter.getField(), filter.getData(), filter.getOp()));
							}
						}
					}
				}
			}
		}
		
		query.asc("itemId");

		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<CustomQuotationItemPO> queryCustomQuotationItemByFunctionAreaIds(List<Long> functionAreaIds){
		return createCriteria(CustomQuotationItemPO.class)
				.add(Restrictions.in("quotationFunctionArea.autoId", functionAreaIds))
				.add(Restrictions.ne("quotationClassification.id", -1))
				.add(Restrictions.ne("quotationBigCategory.id", -1))
				.add(Restrictions.ne("workType.id", -1))
				.addOrder(Order.asc("itemId"))
				.list();
	}

	@Override
	public int deleteCustomQuotationItemByFunctionAreaId(long functionAreaId){
		String hql = "delete CustomQuotationItemPO q where q.quotationFunctionArea.autoId = :quotationFunctionAreaAutoId";
		int deletedEntities = session().createQuery(hql).setLong("quotationFunctionAreaAutoId", functionAreaId).executeUpdate();
		
		return deletedEntities;
	}

	@Override
	public int deleteCustomQuotationItemByitemIds(List<String> itemIds){
		
		if(itemIds.size() == 0){
			return -1;
		}
		
		String hql = "delete CustomQuotationItemPO q where q.itemId in :itemIds";
		int deletedEntities = session().createQuery(hql).setParameterList("itemIds", itemIds).executeUpdate();
		
		return deletedEntities;
	}

	@Override
	public int deleteCustomQuotationItemByIds(List<Long> autoIds) {

		String hql = "delete CustomQuotationItemPO q where q.autoId in :autoIds";
		int deletedEntities = session().createQuery(hql).setParameterList("autoIds", autoIds).executeUpdate();

		return deletedEntities;
	}
	
}
