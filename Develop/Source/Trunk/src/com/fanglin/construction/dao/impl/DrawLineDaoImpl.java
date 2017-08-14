/**
 * @File Name		: DecorationOrderDrawLineDaoImpl
 * @Package   	: com.fanglin.dao
 * @Version		: 1.0
 * @Date			: 2014-9-21
 * @Copyright	: Copyright Creators 2014
 * @Author		:  bty1987
 * @Email			: 
 * @Describing	: 
 */

package com.fanglin.construction.dao.impl;

import java.sql.Timestamp;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.construction.dao.DrawLineDao;
import com.fanglin.construction.po.DrawLinePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.DateUtil;
import com.fanglin.utils.Paging;

@Repository("decorationOrderDrawLineDao")
public class DrawLineDaoImpl extends DaoImpl<DrawLinePO> implements DrawLineDao {

	public DrawLineDaoImpl(){
		super(DrawLinePO.class);
	}
	
	@Override
	public List<DrawLinePO> pageDrawLine(Paging paging, List<Filter> filters, Integer companyId){

		PagingQuery<DrawLinePO> query = pagingQuery(paging, DrawLinePO.class);
		
		query.add(query.getCriterion("decorationOrderPO.company", companyId, "eq"));

		queryFilterExcute(query, filters);

		query.asc("actualStartTime");
		
		return query.list();
	}
	
	@Override
	public List<DrawLinePO> queryDrawLine(List<Filter> filters, Integer companyId) {

		PagingQuery<DrawLinePO> query = pagingQuery(new Paging(), DrawLinePO.class);
		
		query.add(query.getCriterion("decorationOrderPO.company", companyId, "eq"));

		queryFilterExcute(query, filters);

		query.notPaging();
		
		return query.list();
	}

	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLinePO> queryDrawLine(Timestamp startTime, Timestamp endTime, Integer companyId){
		List<String> status = Arrays.asList(new String[]{"放线失败", "排队"});
		
		return (List<DrawLinePO>)createCriteria(DrawLinePO.class)
				
				.createAlias("decorationOrderPO", "decorationOrderPO")
				
				.add(Restrictions.eq("decorationOrderPO.company", companyId))

				.add(Restrictions.not(Restrictions.in("status", status)))

				.add(Restrictions.ge("actualStartTime", startTime))

				.add(Restrictions.le("actualStartTime", endTime))
				
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLinePO> queryDrawLineByOrderId(String orderId){
		return createCriteria(DrawLinePO.class)

				.add(Restrictions.eq("decorationOrderPO.orderId", orderId))

				.addOrder(Order.desc("dlId"))
				.list();
	}
	
	@Override
	@SuppressWarnings("unchecked")
	public List<DrawLinePO> queryDrawLineByGroupATime(long gid, Timestamp startTime,Timestamp endTime, Integer companyId){
		
		List<String> status = Arrays.asList(new String[]{"放线失败", "排队"});
	
		return (List<DrawLinePO>)createCriteria(DrawLinePO.class)
				.createAlias("decorationOrderPO", "decorationOrderPO")
				.createAlias("drawLineGroupPO", "drawLineGroupPO")
				.add(Restrictions.eq("decorationOrderPO.company", companyId))
				.add(Restrictions.eq("drawLineGroupPO.gid", gid))
				.add(Restrictions.not(Restrictions.in("status", status)))
				.add(Restrictions.or(
						Restrictions.or(
							Restrictions.or(
									
									Restrictions.or(
											Restrictions.and(Restrictions.gt("actualStartTime", startTime),Restrictions.lt("actualStartTime", endTime)),
											Restrictions.and(Restrictions.gt("actualEndTime", startTime),Restrictions.lt("actualEndTime", endTime))),
											Restrictions.and(Restrictions.lt("actualStartTime", startTime),Restrictions.gt("actualEndTime", startTime))),
									Restrictions.and(Restrictions.eq("actualStartTime", startTime),Restrictions.eq("actualEndTime", endTime))			
							
						),

						Restrictions.and(Restrictions.gt("actualStartTime", endTime),Restrictions.lt("actualEndTime", endTime)))).list();
	}
	
	private void queryFilterExcute(PagingQuery<?> query, List<Filter> filters){
		if(filters != null){

			query.alias("decorationOrderPO", "decorationOrderPO");
			query.alias("decorationOrderPO.villagePO", "villagePO");
			query.alias("decorationOrderPO.designerPO", "designerPO");
			query.alias("decorationOrderPO.salesmanPO", "salesmanPO");
			
			query.alias("designerPO.dept", "designerDept");
			query.alias("salesmanPO.dept", "salesmanDept");
			
			for(Filter filter: filters){

				if(StringUtils.isNotEmpty(filter.getData())){
					if("orderId".equals(filter.getField())){
						query.add(query.getCriterion("decorationOrderPO.orderId",(filter.getData()), filter.getOp()));
					}else if("villageId".equals(filter.getField())){
						query.add(query.getCriterion("villagePO.villageId", (filter.getData()), filter.getOp()));
					}else if("village".equals(filter.getField())){
						query.add(query.getCriterion("villagePO.villageName", (filter.getData()), filter.getOp()));
					}else if("drawLineGroup".equals(filter.getField())){
						query.add(query.getCriterion("drawLineGroup", (filter.getData()), filter.getOp()));
					}else if("businessDepartment".equals(filter.getField())){				
						query.add(query.getCriterion("salesmanDept.deptName", (filter.getData()), filter.getOp()));
					}else if("designDepartment".equals(filter.getField())){
						query.add(query.getCriterion("designerDept.deptName", (filter.getData()), filter.getOp()));
					}else if("businessDepartmentId".equals(filter.getField())){				
						query.add(query.getCriterion("salesmanDept.deptId", (filter.getData()), filter.getOp()));
					}else if("designDepartmentId".equals(filter.getField())){
						query.add(query.getCriterion("designerDept.deptId", (filter.getData()), filter.getOp()));
					}else if("salesmanId".equals(filter.getField())){
						query.add(query.getCriterion("salesmanPO.userId", (filter.getData()), filter.getOp()));
					}else if("designerId".equals(filter.getField())){
						query.add(query.getCriterion("designerPO.userId", (filter.getData()), filter.getOp()));
					}else if("salesman".equals(filter.getField())){
						query.add(query.getCriterion("salesmanPO.currentName", (filter.getData()), filter.getOp()));
					}else if("designer".equals(filter.getField())){
						query.add(query.getCriterion("designerPO.currentName", (filter.getData()), filter.getOp()));
					}else if("status".equals(filter.getField())){
						query.add(query.getCriterion("status", (filter.getData()), filter.getOp()));
					}else if("actualDate".equals(filter.getField())){
						
						if("between".equals(filter.getOp())){
							String sTime = filter.getData() + " 00:00:00";
				            String eTime = filter.getData() + " 23:59:59";

				            Date sDate = DateUtil.parseDate(sTime, "yyyy-MM-dd HH:mm:ss");
				            Date eDate = DateUtil.parseDate(eTime, "yyyy-MM-dd HH:mm:ss");

				            Timestamp sTimestamp = DateUtil.getDateToTimestamp(sDate);
				            Timestamp eTimestamp = DateUtil.getDateToTimestamp(eDate);
							query.add(query.getCriterion("actualStartTime", sTimestamp, "ge"));
							query.add(query.getCriterion("actualStartTime", eTimestamp, "le"));
						}else{
							query.add(query.getCriterion("actualStartTime", filter.getData(), filter.getOp()));
						}
					}else {
						query.add(query.getCriterion(filter.getField(),(filter.getData()), filter.getOp()));
					}
				}
			}
		}
	}
}
