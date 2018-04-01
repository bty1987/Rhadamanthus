package com.fanglin.building.dao.impl;

import java.math.BigInteger;
import java.util.List;

import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.fanglin.building.dao.HouseSourceDao;
import com.fanglin.building.po.HouseSourcePO;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.core.vo.Filter;
import com.fanglin.utils.Paging;

@Repository("houseSourceDao")
public class HouseSourceDaoImpl extends DaoImpl<HouseSourcePO> implements HouseSourceDao {

	public HouseSourceDaoImpl(){
		super(HouseSourcePO.class);
	}
	
	@Override
	public List<HouseSourcePO> pageHouseSource(Paging paging, List<Filter> filters, List<Integer> dids) {
		
		//条件：城区(楼盘) , 单价 , 面积 , 朝向 , 户型(房间数), 房源类型, 装修程度, 房产类型
		PagingQuery<HouseSourcePO> query = pagingQuery(paging, HouseSourcePO.class);
		
		if(dids != null){
			query.alias("department", "department").add(query.getCriterion("department.did", dids, "in"));
		}
		
		if(filters != null){
			
			for (Filter filter : filters) {
				
				String field = filter.getField();
				String data = filter.getData();
				String op = filter.getOp();
				
				query.alias("house", "house");
				
				if("villageNo".equals(filter.getField())){
					query.alias("house.village", "village");
					query.add(query.getCriterion("village.no", filter));
				}else if("orientation".equals(field)){
					query.add(query.getCriterion("house.orientation", Short.valueOf(data), op));
				}else if("roomNum".equals(field)){
					if(data.equals("6")){
						query.add(Restrictions.ge("house.roomNum", Integer.valueOf(data)));
					}else{
						query.add(query.getCriterion("house.roomNum", Integer.valueOf(data), op));
					}
				}else if("no".equals(field)){
					query.add(query.getCriterion("no", data, op));
				}else if("buildingArea".equals(field)){
					String area[] = filter.getData().split("-");
					query.add(Restrictions.ge("house.buildArea", Float.valueOf(area[0])));
					query.add(Restrictions.le("house.buildArea", Float.valueOf(area[1])));
				}else if("unitPrice".equals(field)){
					String price[] = filter.getData().split("-");
					query.add(Restrictions.ge("unitPrice", Float.valueOf(price[0])));
					query.add(Restrictions.le("unitPrice", Float.valueOf(price[1])));
				}else if("totalPrice".equals(field)){
					String price[] = filter.getData().split("-");
					query.add(Restrictions.ge("totalPrice", Float.valueOf(price[0])));
					query.add(Restrictions.le("totalPrice", Float.valueOf(price[1])));
				}else if("houseSourceType".equals(field)){
					query.add(query.getCriterion("type", Short.valueOf(data), op));
				}else if("decorateDegree".equals(field)){
					query.add(query.getCriterion("decorateDegree", Short.valueOf(data), op));
				}else if("type".equals(field)){
					query.add(query.getCriterion("house.type", Short.valueOf(data), op));
				}else if("allowLoan".equals(field)){
					query.add(query.getCriterion("allowLoan", Short.valueOf(data), op));
				}else if("housingGrade".equals(field)){
					query.add(query.getCriterion("housingGrade", data, op));
				}else if("rentType".equals(field)){
					query.add(query.getCriterion("rentType", Short.valueOf(data), op));
				}else if("status".equals(field)){
					query.add(query.getCriterion("status", Short.valueOf(data), op));
				}else if("followUser".equals(field)){
					query.alias("followUser", "followUser");
					query.add(query.getCriterion("followUser.uid", Integer.valueOf(data), op));
				}
			}
			
		}
		
		return query.list();
		
	}
	
	@Override
	public HouseSourcePO queryHouseSourceByNo(String no) {
		
		return (HouseSourcePO)session().createCriteria(HouseSourcePO.class).add(Restrictions.eq(HouseSourcePO.COLUMN_NO_STR, no)).uniqueResult();
		
	}
	
	@Override
	public HouseSourcePO checkHouseSource(Long hid, Short type) {
		
		return (HouseSourcePO)session().createCriteria(HouseSourcePO.class).add(Restrictions.eq(HouseSourcePO.COLUMN_HID_STR, hid)).add(Restrictions.eq(HouseSourcePO.COLUMN_TYPE_STR, type)).uniqueResult();
	
	}

	@Override
	public int countHouseSource(Long hid, Short type) {
		
		String sql = "select count(*) from building.houseSource where hid = :hid and type = :type";
		BigInteger count = (BigInteger) session().createSQLQuery(sql).setLong("hid", hid).setShort("type", type).uniqueResult();
		
		return count.intValue();
	}

}
