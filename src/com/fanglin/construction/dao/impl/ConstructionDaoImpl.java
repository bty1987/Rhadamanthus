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

@Repository("constructionDao")
public class ConstructionDaoImpl extends DaoImpl<ConstructionPO> implements ConstructionDao {

	
	public ConstructionDaoImpl(){
		super(ConstructionPO.class);
	}

	@Override
	public List<ConstructionPO> pageConstruction(Paging paging, List<Filter> filters, Integer company) {
		
		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);

		query.add(query.getCriterion("decoration.company", company, "eq"));
		
		queryFilterExcute(query, filters);
		
		return query.list();
	}

	@Override
	public List<ConstructionPO> pageConstructionForSupervision(Paging paging, List<Filter> filters, int suid){
		
		PagingQuery<ConstructionPO> query = pagingQuery(paging, ConstructionPO.class);
		
		query.alias("supervisor", "supervisor").add(query.getCriterion("supervisor.uid", suid, "eq"));
		
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
		
		query.add(query.getCriterion("decoration.company", company, "eq"));
		
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
		
		query.alias("decoration", "decoration");
		
		if(filters != null){
			for(Filter filter: filters){
					
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				//pageConstructionForAcceptance工程验收
				if(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR.equals(field)){
					if("and".equals(op)){
						query.add(Restrictions.sqlRestriction(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE));
					}else if("nand".equals(op)){
						query.add(Restrictions.not(Restrictions.sqlRestriction(ConstructionPO.COLUMN_ALLOCATIONWORKERFLAG_STR + " & ?", data.toString(), StringType.INSTANCE)));
					}
				}
				
				if(field.startsWith("design")){
					query.alias("decoration.designer", "designer");
				}else if((field.startsWith("business") || field.startsWith("salesman"))){
					query.alias("decoration.salesman", "salesman");
				}else if(field.startsWith("village")){
					query.alias("decoration.house", "house");
					query.alias("house.village", "village");
				}
				
				if("orderId".equals(field)){
					query.add(query.getCriterion("decoration.orderId", data, op));
				}else if("houseNumber".equals(field)){
					query.alias("decoration.house", "house");
					query.add(query.getCriterion("house.houseNumber", data, op));
				}else if("designer".equals(field)){
					query.add(query.getCriterion("designer.userId", data, op));
				}else if("salesman".equals(field)){
					query.add(query.getCriterion("salesman.userId", data, op));
				}else if("supervisor".equals(field)){
					query.alias("decoration.supervisor", "supervisor");
					query.add(query.getCriterion("supervisor.userId", data, op));
				}else if("village".equals(field)){ 
					query.add(query.getCriterion("village.no", data, op));
				}else if(ConstructionPO.COLUMN_SCHEDULE_STR.equals(field)){
					query.add(Restrictions.eq(field, Integer.valueOf(data)));
				}else if("projectStatus".equals(field) && !"other".equals(data)){
					if("未完工".equals(data)){
						query.add(query.getCriterion("decoration.projectStatus", "已完工", "ne"));
					}else{
						query.add(query.getCriterion("decoration.projectStatus", "已完工", "eq"));
					}
				}
			}
		}
	}

	@Override
	public ConstructionPO queryConstructionByCid(long cid) {
		
		return (ConstructionPO) session().createCriteria(ConstructionPO.class).add(Restrictions.eq(ConstructionPO.COLUMN_CID_STR, cid)).uniqueResult();
	
	}
	
}
