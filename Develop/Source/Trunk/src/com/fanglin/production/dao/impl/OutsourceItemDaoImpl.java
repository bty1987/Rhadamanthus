package com.fanglin.production.dao.impl;

import java.util.List;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import com.fanglin.core.dao.impl.DaoImpl;
import com.fanglin.production.dao.OutsourceItemDao;
import com.fanglin.production.po.OutsourceItemPO;
@Repository("outsourceItemDao")
public class OutsourceItemDaoImpl extends DaoImpl<OutsourceItemPO>  implements OutsourceItemDao{
	
	public OutsourceItemDaoImpl (){
		super (OutsourceItemPO.class);
	}
	
	@SuppressWarnings("unchecked")
	@Override
	public List<OutsourceItemPO> queyOutsourceItemByoid(Long oid) {
		
		return session().createCriteria(OutsourceItemPO.class).add(Restrictions.eq(OutsourceItemPO.COLUMN_OID, oid)).list();
	}

}
