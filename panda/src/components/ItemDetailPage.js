import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ItemDetailPage.css";
import profile from "../icon/profile.png";
import heart from "../icon/heart32.png";
import back from "../icon/ic_back.png";
import { Link } from "react-router-dom"; // Link 추가


function ItemDetailPage() {
  const { productId } = useParams(); // URL에서 productId를 가져옴
  const [product, setProduct] = useState(null); // 상품 데이터 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 관리
  const [error, setError] = useState(null); // 에러 상태 관리
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]); // 댓글 리스트



  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`https://panda-market-api.vercel.app/products/${productId}`); // API 호출
        if (!response.ok) {
          throw new Error("실패");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };
    
    const fetchComments = async () => {
        try {
          const response = await fetch(
            `https://panda-market-api.vercel.app/products/${productId}/comments?limit=3`
          ); // limit은 페이지당 댓글 수
          if (!response.ok) {
            throw new Error("Failed to fetch comments.");
          }
      
          const data = await response.json();
          setComments(data.list); // list 배열을 상태로 저장
        } catch (err) {
          console.error("Error fetching comments:", err);
        }
      };
      



    fetchProduct();
    fetchComments();
  }, [productId]);

  if (loading) {
    return <p>Loading...</p>; // 로딩 중 메시지
  }

  if (error) {
    return <p>Error: {error}</p>; // 에러 메시지
  }

  if (!product) {
    return <p>Product not found.</p>; // 상품 데이터가 없는 경우
  }

  // 데이터 구조에서 필요한 정보 추출
  const { favoriteCount, images, tags, name, description, price, createdAt, ownerNickname} = product;

  function Price({ price }) {
    const formattedPrice = new Intl.NumberFormat().format(price);
  
    return <div>{formattedPrice}원  </div>;
  }

  const handleInputChange = (event) => {
    setComment(event.target.value);
  };  

  const handleCommentSubmit = async () => {
    if (!comment.trim()) return;
  
    try {
      const response = await fetch(
        `https://panda-market-api.vercel.app/products/${productId}/comments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content: comment }),
        }
      );
  
      console.log("Response status:", response.status); // 응답 상태 출력
  
      if (!response.ok) {
        throw new Error("댓글 등록 실패");
      }
  
      const newComment = await response.json();
      console.log("New comment added:", newComment); // 새 댓글 로그
      setComments((prevComments) => [newComment, ...prevComments]);
      setComment(""); // 입력 초기화
    } catch (err) {
      console.error("댓글 등록 중 오류:", err);
    }
  };
  
  
  


  return (
    <div className="body">
        <div className="ItemDetail_Container">   
            <div className="ItemDetail">
                <div className="ItemDetail-Data_Container">  
                    <div className="ItemDetail-Data">
                        <div className="ItemDetail-Data_Img">
                            {images.map((image, index) => (
                                <img key={index} src={image} alt={`${name}-${index}`} />
                                ))}
                        </div>
                        <div className="ItemDetail-Data-Text_Container">
                            <div className="ItemDetail-Data-Text">
                                <div className="ItemDetail-Data-Text-Header_Container">
                                    <div className="ItemDetail-Data-Text-Header">
                                        <div className="ItemDetail-Data-Text-Header-Text">
                                            <div className="ItemDetail-Data-Text-Header-Text_Title">
                                                 <p className="Title_text">{name}</p>
                                            </div>
                                            <div className="ItemDetail-Data-Text-Header-Text_Price">
                                                <p className="Price_text"><Price price={price} />
                                                </p>
                                            </div>
                                        </div>  
                                        <div className="ItemDetail-Data-Text-Header_Btn">
                                              
                                        </div>
                                    </div>                
                                </div>
                                <div className="ItemDetail-Data-Text-Footer">
                                    <div className="ItemDetail-Data-Text-Footer_Descrption">
                                        <div className="ItemDetail-Data-Text-Footer_Descrption-Title">
                                            <p className="Descrition-Title-Text">상품 소개</p>
                                        </div>
                                        <div className="ItemDetail-Data-Text-Footer_Descrption-Detail">
                                            <p className="product-description">{description}</p>
                                        </div>

                                    </div>
                                    <div className="ItemDetail-Data-Text-Footer_Tag">
                                        <div className="ItemDetail-Data-Text-Footer_Tag-Title">
                                            <p className="Descrition-Title-Text">상품 태그</p>
                                        </div>
                                        <div className="ItemDetail-Data-Text-Footer_Tag-List">
                                            {tags.map((tag, index) => (
                                            <span key={index} className="tag">
                                                    #{tag}
                                            </span>
                                            ))}
                                        </div>
                                    </div>
                          
                                </div>
                            </div>

                            <div className="ItemDetail-Data-Footer">
                                <div className="ItemDetail-Data-Footer_Profile">
                                    <div className="ItemDetail-Data-Footer_Profile_Logo">
                                       <img src={profile} />
                                    </div>
                                    <div className="ItemDetail-Data-Footer_Profile_Text">
                                        <div className="ItemDetail-Data-Footer_Profile_Text_nickname">
                                            <p className="Nickname">{ownerNickname}</p>
                                        </div>
                                        <div className="ItemDetail-Data-Footer_Profile_Text_Date">
                                            <p className="Date">{createdAt.split("T")[0]}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="ItemDetail-Data-Footer_Heart">
                                    <div className="ItemDetail-Data-Footer_Heart_btn">
                                        <div className="ItemDetail-Data-Footer_Heart_btn_inner">
                                            <img src={heart} alt="좋아요" className="heartIcon" />
                                            <span className="faovriteCount">{favoriteCount}</span>
                                        </div>
                                    </div>
                                </div>
                                
                            </div>
                       
                            

                        </div>
                    </div>              
                </div>

                <div className="ItemDetail-Comment">
                    <div className="ItemDetail-Comment_Register">
                        <div className="ItemDetail-Comment_Register_Input_Container">
                            <div className="ItemDetail-Comment_Register_Input_Title">
                                <p className="Descrition-Title-Text">문의하기</p>
                            </div>
                            <input 
                                type="text"
                                value={comment}
                                onChange={handleInputChange}
                                placeholder="개인정보를 공유 및 요청하거나, 명예 훼손, 무단 광고, 불법 정보 유포시 모니터링 후 삭제될 수 있으며, 이에 대한 민형사상 책임은 게시자에게 있습니다."
                                className="ItemDetail-Comment_Register_Input"
                            ></input>
                        </div>
                        <button 
                            className="ItemDetail-Comment_Register_Btn"
                            disabled={!comment.trim()}
                            style={{
                                backgroundColor: comment.trim() ? '#3692FF' : '#D1D5DB',
                            }}
                            onClick={handleCommentSubmit}   
                        > 
                            <p className="ItemDetail-Comment_Register_Btn_text">등록</p>
                        </button>
                    </div>

                    <div className="ItemDetail-Comment_List">
                        {comments.map((comment) => (
                            <div key={comment.id} className="ItemDetail-Comment_Lists">
                                <div className="ItemDetail-Comment_Lists_Text">
                                    <p className="ItemDetail-Comment_Lists_Text_font">{comment.content}</p>
                                </div>
                                <div className="ItemDetail-Comment_Lists_Profile">
                                    <img 
                                        src={comment.writer.image || profile} // writer.image를 사용
                                        className="ItemDetail-Comment_Lists_Profile_img"
                                    />
                                    <div className="ItemDetail-Comment_Lists_Profile_text">
                                        <p className="ItemDetail-Comment_Lists_Profile_text_nickname">{comment.writer.nickname}</p> {/* writer.nickname */}
                                        {/*<p className="comment-date">{comment.updatedAt.split("T")[0]}</p>*/}
                                        <p className="ItemDetail-Comment_Lists_Profile_text_time">bbb</p>
                                    </div>
                                </div>      
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="ItemDetail-Footer">
                <Link to="/items">                                
                    <button className="ItemDetail-Footer_Btn">
                        <p className="ItemDetail-Footer_Btn_Text">목록으로 돌아가기</p>
                        <img src={back} className="ItemDetail-Footer_Btn_Logo" />
                    </button>
                </Link>                               
            </div>
        </div>
    </div>    

   
  );
}

export default ItemDetailPage;
