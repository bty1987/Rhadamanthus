/**
 * @File Name	: ConstructionDaoImpl.java
 * @Package   	: com.fanglin.dao.impl.construction
 * @Version		: 1.0
 * @Date		: 2014-9-27
 * @Copyright	: Copyright Creators 2014
 * @Author		: baity
 * @Email		: bty1987@163.com
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.hibernate.type.StringType;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.ConstructionDao;
import com.fanglin.construction.po.ConstructionPO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;
import com.fanglin.utils.SystemConfig;

@Repository("constructionDao")
public class ConstructionDaoImpl extends DaoImpl<ConstructionPO> implements ConstructionDao {

	public ConstructionDaoImpl(){
		super(ConstructionPO.class);
	}

	@Override
	public List<ConstructionPO> pageConstruction(Paging paging, List<Filter> filters, Integer company) {
		
		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);
		
		query.add(query.getCriterion("decorationOrderPO.company", company, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<ConstructionPO> pageConstructionForSupervision(Paging paging, List<Filter> filters, Integer company){
		
		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);
		
		query.add(query.getCriterion("decorationOrderPO.company", company, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<ConstructionPO> pageConstructionForSupervisionByUserId(Paging paging, List<Filter> filters, String workTypeQuality, String userId){
		
		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);
		
		if(workTypeQuality == ""){
			return new ArrayList<ConstructionPO>();
		}
		
		query.add(Restrictions.eq(workTypeQuality, userId));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	public List<ConstructionPO> pageConstructionForAcceptance(Paging paging, List<Filter> filters, Integer company){
		
		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);
		
		query.add(query.getCriterion("decorationOrderPO.company", company, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<ConstructionPO> queryConstructionForSupervisionByUserId(List<Filter> filters, String supervisionUserId){
		
		Criteria query = session().createCriteria(ConstructionPO.class).add(Restrictions.eq(ConstructionPO.COLUMN_SUPERVISORQUALITYID_STR, supervisionUserId));
		
		if(filters != null){
			for(Filter filter: filters){
				if(ConstructionPO.COLUMN_SCHEDULE_STR.equals(filter.getField())){
					query.add(Restrictions.eq(filter.getField(), filter.getData()));
				}
			}
		}
		
		return query.list();
	}

	@Override
	public ConstructionPO queryConstructionByOrderId(String orderId){
		
		return (ConstructionPO) session().createCriteria(ConstructionPO.class).add(Restrictions.eq(ConstructionPO.COLUMN_ORDERID_STR, orderId)).uniqueResult();
	
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		
		query.alias("decorationOrderPO", "decorationOrderPO");
		
		if(filters != null){
			for(Filter filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				//pageConstructionForSupervision监理控制
				if(ConstructionPO.COLUMN_SUPERVISORQUALITYID_STR.equals(field)){
					query.add(Restrictions.eq(field, data));
				}
				
				//pageConstructionForAcceptance工程验收
				if(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR.equals(field)){
					if("and".equals(op)){
						query.add(Restrictions.sqlRestriction(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE));
					}else if("nand".equals(op)){
						query.add(Restrictions.not(Restrictions.sqlRestriction(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE)));
					}
				}
				
				if(field.startsWith("design")){
					query.alias("decorationOrderPO.designerPO", "designer");
				}else if((field.startsWith("business") || field.startsWith("salesman"))){
					query.alias("decorationOrderPO.salesmanPO", "salesman");
				}else if(field.startsWith("village")){
					query.alias("decorationOrderPO.villagePO", "village");
				}
				
				if("orderId".equals(field)){
					query.add(query.getCriterion("decorationOrderPO.orderId", data, op));
				}else if("houseNumber".equals(field)){
					query.add(query.getCriterion("decorationOrderPO.houseNumber", data, op));
				}else if("designerId".equals(field)){
					query.add(query.getCriterion("designer.userId", data, op));
				}else if("salesmanId".equals(field)){
					query.add(query.getCriterion("salesman.userId", data, op));
				}else if("villageId".equals(field)){
					query.add(query.getCriterion("village.villageId", data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion("designer.currentName", data, op));
				}else if("salesman".equals(field)){
					query.add(query.getCriterion("salesman.currentName", data, op));
				}else if("supervisor".equals(field)){
					query.alias("decorationOrderPO.supervisorPO", "supervisor");
					query.add(query.getCriterion("supervisor.currentName", data, op));
				}else if("village".equals(field)){ 
					query.add(query.getCriterion("village.villageName", data, op));
				}else if(ConstructionPO.COLUMN_SCHEDULE_STR.equals(field)){
					query.add(Restrictions.eq(field, Integer.valueOf(data)));
				}else if("projectStatus".equals(field) && !"other".equals(data)){
					if("未完工".equals(data)){
						query.add(query.getCriterion("decorationOrderPO.projectStatus", "已完工", "ne"));
					}else{
						query.add(query.getCriterion("decorationOrderPO.projectStatus", "已完工", "eq"));
					}
				}else if("villageSeat".equals(field)){
					
					double x = Double.parseDouble(data.split(":")[0]);
					double y =  Double.parseDouble(data.split(":")[1]);
					
					double seatRang = SystemConfig.getDouble("seatRang");
					
					query.add(Restrictions.between("village.x", (x - seatRang), (x + seatRang)));
					query.add(Restrictions.between("village.y", (y - seatRang), (y + seatRang)));
				}
			}
		}
	}

	@Override
	public ConstructionPO queryConstructionByCid(long cid) {
		
		return (ConstructionPO) session().createCriteria(ConstructionPO.class).add(Restrictions.eq(ConstructionPO.COLUMN_CID_STR, cid)).uniqueResult();
	
	}
	
}
