package com.fanglin.customer.po;

import static javax.persistence.GenerationType.IDENTITY;
import java.io.Serializable;
import java.sql.Timestamp;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import com.fanglin.personel.po.UserPO;
import com.fanglin.decoration.po.DecorationPO;


@Entity
@Table(name = "revisit", catalog = "customer")
public class RevisitPO  implements Serializable{
	
private static final long serialVersionUID = -5353289715243468596L;
     
     public static final short CUSTOMER_TYPE_INIT_AEPAIR = 0;//保修
     
     public static final short CUSTOMER_TYPE_INIT_COMPLAIN = 1;//投诉
     
	 private long rid;
	 
	 private DecorationPO decoration;
	 
	 private short type;
	 
	 private long ident;
	 
	 private UserPO creater; 
	 
	 private Timestamp createTime;
	 
	 private short gladness;
	 
	 private String content;
	 
	 public RevisitPO() {
		 super();
	 }
	
	 public RevisitPO(DecorationPO decoration, UserPO creater) {
		 super();
		 this.decoration = decoration;
		 this.creater = creater;
	 }
	
	 @Id
	 @GeneratedValue(strategy = IDENTITY)
	 @Column(name="rid") 
	 public long getRid() {
	 	 return rid;
	 }
	 public void setRid(long rid) {
	 	 this.rid = rid;
	 }
	
	 @ManyToOne(fetch = FetchType.LAZY)
	 @JoinColumn(nullable = false, name = "decoration",referencedColumnName="doid")
	 public DecorationPO getDecoration() {
	 	 return decoration;
	 }
	 public void setDecoration(DecorationPO decoration) {
	 	 this.decoration = decoration;
	 }
	
	 @Column(name="type")
	 public short getType() {
	 	 return type;
	 }
	 public void setType(short type) {
	 	 this.type = type;
	 }
	
 	 @Column(name="ident")
	 public long getIdent() {
		 return ident;
	 }
	 public void setIdent(long ident) {
		 this.ident = ident;
	 }
	
	 @ManyToOne(fetch = FetchType.LAZY)
	 @JoinColumn(nullable = false, name = "creater",referencedColumnName="uid")
	 public UserPO getCreater() {
		 return creater;
	 }
	 public void setCreater(UserPO creater) {
		 this.creater = creater;
	 }
	
	 @Column(name="createTime")
	 public Timestamp getCreateTime() {
	 	 return createTime;
	 }
	 public void setCreateTime(Timestamp createTime) {
		 this.createTime = createTime;
	 }
	
	 @Column(name="gladness")
	 public short getGladness() {
		 return gladness;
	 }
	 public void setGladness(short gladness) {
		 this.gladness = gladness;
	 }
	
	 @Column(name="content")
	 public String getContent() {
		 return content;
	 }
	 public void setContent(String content) {
		 this.content = content;
	 } 
}
